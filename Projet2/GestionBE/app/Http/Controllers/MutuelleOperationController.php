<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\AffiliationMutuelle;
use App\Models\MutuelleOperation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MutuelleOperationController extends Controller
{
    private array $typeOptions = [
        'DEPOT_DOSSIER',
        'REMBOURSEMENT',
        'PRISE_EN_CHARGE',
        'RECLAMATION',
        'ATTESTATION',
        'REGULARISATION',
        'AUTRE',
    ];

    private array $statutOptions = ['EN_COURS', 'TERMINEE', 'REMBOURSEE', 'ANNULEE'];

    private array $beneficiaireTypeOptions = ['EMPLOYE', 'CONJOINT', 'ENFANT'];

    /**
     * Normalise un libellé vers un code technique (MAJ + underscores, sans accents)
     */
    private function normalizeType(string $value): string
    {
        return Str::of($value)
            ->ascii()
            ->upper()
            ->replaceMatches('/[^A-Z0-9]+/', '_')
            ->trim('_')
            ->value();
    }

    /**
     * Alias connus pour mapper code <-> libellé (sécurité backward)
     */
    private function typeAliases(string $value): array
    {
        $normalized = $this->normalizeType($value);
        $map = [
            'DEPOT_DOSSIER' => ['DÉPÔT DOSSIER', 'DEPOT DOSSIER'],
            'REMBOURSEMENT' => ['REMBOURSEMENT'],
            'PRISE_EN_CHARGE' => ['PRISE EN CHARGE'],
            'RECLAMATION' => ['RÉCLAMATION', 'RECLAMATION'],
            'ATTESTATION' => ['ATTESTATION'],
            'REGULARISATION' => ['RÉGULARISATION', 'REGULARISATION'],
            'AUTRE' => ['AUTRE'],
        ];

        $aliases = [$value, $normalized];
        if (isset($map[$normalized])) {
            $aliases = array_merge($aliases, $map[$normalized]);
        }
        // + version upper simple (sans underscore) pour les anciennes données éventuelles
        $aliases[] = Str::of($value)->upper()->value();

        return array_values(array_unique($aliases));
    }

    /**
     * Liste toutes les opérations (ou filtrées par affiliation)
     */
    public function index(Request $request)
    {
        $query = MutuelleOperation::with(['affiliation.employe', 'affiliation.mutuelle']);

        // Filtrage optionnel par affiliation
        if ($request->has('affiliation_id')) {
            $query->where('affiliation_id', $request->affiliation_id);
        }

        // Filtrage optionnel par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $operations = $query->orderByDesc('date_operation')->get();

        return response()->json($operations);
    }

    /**
     * Créer une nouvelle opération
     */
    public function store(Request $request)
    {
        // Validation de base
        $validator = Validator::make($request->all(), [
            'affiliation_id' => 'required|exists:affiliations_mutuelle,id',
            'numero_dossier' => 'nullable|string|max:191',
            'beneficiaire_type' => ['required', Rule::in($this->beneficiaireTypeOptions)],
            'beneficiaire_nom' => 'nullable|string|max:191',
            'lien_parente' => 'nullable|string|max:191',
            'date_operation' => 'required|date',
            'date_depot' => 'nullable|date',
            'date_remboursement' => 'nullable|date',
            'type_operation' => 'required|string|max:191',
            'statut' => ['required', 'string', Rule::in($this->statutOptions)],
            'montant_total' => 'nullable|numeric|min:0',
            'montant_rembourse' => 'nullable|numeric|min:0',
            'commentaire' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'message' => 'Données invalides : ' . implode(', ', array_map(fn($e) => implode(', ', $e), $validator->errors()->toArray()))], 422);
        }

        $validated = $validator->validated();
        $validated['type_operation'] = $this->normalizeType($validated['type_operation']);

        // Validation du bénéficiaire selon l'affiliation
        $affiliation = AffiliationMutuelle::with('employe')->find($validated['affiliation_id']);
        $beneficiaireType = $validated['beneficiaire_type'];
        $beneficiaireNom = $validated['beneficiaire_nom'] ?? null;
        $lienParente = $validated['lien_parente'] ?? null;
        $beneficiaireNom = $beneficiaireNom ? trim($beneficiaireNom) : null;
        $lienParente = $lienParente ? trim($lienParente) : null;
        $employeeFullName = trim(($affiliation->employe->nom ?? '') . ' ' . ($affiliation->employe->prenom ?? ''));
        
        if ($beneficiaireType === 'CONJOINT' && !$affiliation->conjoint_ayant_droit) {
            return response()->json([
                'errors' => ['beneficiaire_type' => ['Le conjoint n\'est pas autorisé pour cette affiliation.']],
                'message' => 'Le conjoint n\'est pas autorisé pour cette affiliation.'
            ], 422);
        }

        if ($beneficiaireType === 'ENFANT' && !$affiliation->ayant_droit) {
            return response()->json([
                'errors' => ['beneficiaire_type' => ['Les enfants ne sont pas autorisés pour cette affiliation.']],
                'message' => 'Les enfants ne sont pas autorisés pour cette affiliation.'
            ], 422);
        }

        if ($beneficiaireType === 'EMPLOYE') {
            $beneficiaireNom = $beneficiaireNom ?: ($employeeFullName ?: 'Employé');
            $lienParente = 'Employé';
        } else {
            if (!$beneficiaireNom || trim($beneficiaireNom) === '') {
                return response()->json([
                    'errors' => ['beneficiaire_nom' => ['Le nom du bénéficiaire est requis.']],
                    'message' => 'Le nom du bénéficiaire est requis.'
                ], 422);
            }

            if (!$lienParente || trim($lienParente) === '') {
                return response()->json([
                    'errors' => ['lien_parente' => ['Le lien de parenté est requis pour ce bénéficiaire.']],
                    'message' => 'Le lien de parenté est requis pour ce bénéficiaire.'
                ], 422);
            }
        }

        // Calcul reste à charge
        $montantTotal = $validated['montant_total'] ?? 0;
        $montantRembourse = $validated['montant_rembourse'] ?? 0;
        $resteACharge = max($montantTotal - $montantRembourse, 0);

        $operation = MutuelleOperation::create([
            'affiliation_id' => $validated['affiliation_id'],
            'numero_dossier' => $validated['numero_dossier'] ?? null,
            'beneficiaire_type' => $beneficiaireType,
            'beneficiaire_nom' => $beneficiaireNom,
            'lien_parente' => $lienParente,
            'date_operation' => $validated['date_operation'],
            'date_depot' => $validated['date_depot'] ?? null,
            'date_remboursement' => $validated['date_remboursement'] ?? null,
            'type_operation' => $validated['type_operation'],
            'statut' => $validated['statut'],
            'montant_total' => $montantTotal,
            'montant_rembourse' => $montantRembourse,
            'reste_a_charge' => $resteACharge,
            'commentaire' => $validated['commentaire'] ?? null,
        ]);

        return response()->json($operation->load(['affiliation.employe', 'affiliation.mutuelle', 'documents']), 201);
    }

    /**
     * Afficher une opération spécifique
     */
    public function show(MutuelleOperation $operation)
    {
        return response()->json($operation->load(['affiliation.employe', 'affiliation.mutuelle']));
    }

    /**
     * Mettre à jour une opération
     */
    public function update(Request $request, MutuelleOperation $operation)
    {
        if ($operation->statut === 'ANNULEE') {
            return response()->json(['message' => 'Opération annulée non modifiable'], 403);
        }

        $validator = Validator::make($request->all(), [
            'numero_dossier' => 'nullable|string|max:191',
            'beneficiaire_type' => ['sometimes', Rule::in($this->beneficiaireTypeOptions)],
            'beneficiaire_nom' => 'nullable|string|max:191',
            'lien_parente' => 'nullable|string|max:191',
            'date_operation' => 'sometimes|date',
            'date_depot' => 'nullable|date',
            'date_remboursement' => 'nullable|date',
            'type_operation' => 'sometimes|string|max:191',
            'statut' => ['sometimes', 'string', Rule::in($this->statutOptions)],
            'montant_total' => 'nullable|numeric|min:0',
            'montant_rembourse' => 'nullable|numeric|min:0',
            'commentaire' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'message' => 'Données invalides : ' . implode(', ', array_map(fn($e) => implode(', ', $e), $validator->errors()->toArray()))], 422);
        }

        $validated = $validator->validated();
        if (isset($validated['type_operation'])) {
            $validated['type_operation'] = $this->normalizeType($validated['type_operation']);
        }

        $affiliation = $operation->affiliation()->with('employe')->first();

        // Validation du bénéficiaire si changement
        if (isset($validated['beneficiaire_type'])) {          
            if ($validated['beneficiaire_type'] === 'CONJOINT' && !$affiliation->conjoint_ayant_droit) {
                return response()->json([
                    'errors' => ['beneficiaire_type' => ['Le conjoint n\'est pas autorisé pour cette affiliation.']]
                ], 422);
            }

            if ($validated['beneficiaire_type'] === 'ENFANT' && !$affiliation->ayant_droit) {
                return response()->json([
                    'errors' => ['beneficiaire_type' => ['Les enfants ne sont pas autorisés pour cette affiliation.']]
                ], 422);
            }
        }

        $beneficiaireType = $validated['beneficiaire_type'] ?? $operation->beneficiaire_type;
        $beneficiaireNom = array_key_exists('beneficiaire_nom', $validated) ? $validated['beneficiaire_nom'] : $operation->beneficiaire_nom;
        $lienParente = array_key_exists('lien_parente', $validated) ? $validated['lien_parente'] : $operation->lien_parente;
        $beneficiaireNom = $beneficiaireNom ? trim($beneficiaireNom) : null;
        $lienParente = $lienParente ? trim($lienParente) : null;
        $employeeFullName = trim(($affiliation->employe->nom ?? '') . ' ' . ($affiliation->employe->prenom ?? ''));

        if ($beneficiaireType === 'EMPLOYE') {
            $validated['beneficiaire_nom'] = $employeeFullName ?: $beneficiaireNom;
            $validated['lien_parente'] = 'Employé';
        } else {
            if (!$beneficiaireNom || trim($beneficiaireNom) === '') {
                return response()->json([
                    'errors' => ['beneficiaire_nom' => ['Le nom du bénéficiaire est requis.']]
                ], 422);
            }

            if (!$lienParente || trim($lienParente) === '') {
                return response()->json([
                    'errors' => ['lien_parente' => ['Le lien de parenté est requis pour ce bénéficiaire.']]
                ], 422);
            }

            $validated['beneficiaire_nom'] = $beneficiaireNom;
            $validated['lien_parente'] = $lienParente;
        }

        // Recalculer reste à charge si changement des montants
        if (isset($validated['montant_total']) || isset($validated['montant_rembourse'])) {
            $montantTotal = $validated['montant_total'] ?? $operation->montant_total;
            $montantRembourse = $validated['montant_rembourse'] ?? $operation->montant_rembourse;
            $validated['reste_a_charge'] = max($montantTotal - $montantRembourse, 0);
        }

        $operation->update($validated);

            return response()->json($operation->load(['affiliation.employe', 'affiliation.mutuelle', 'documents']));
    }

    /**
     * Supprimer une opération
     */
    public function destroy(MutuelleOperation $operation)
    {
        // Restriction removed per user request: Allow deletion regardless of status
        /*
        if ($operation->statut === 'REMBOURSEE') {
            return response()->json(['message' => 'Opération remboursée non supprimable'], 403);
        }
        */

        $operation->delete();

        return response()->json(['message' => 'Opération supprimée'], 200);
    }

    /**
     * Méthode de compatibilité : Liste des opérations par employé
     * GET /api/employes/{employe}/mutuelle-operations
     */
    public function indexByEmploye(Employe $employe)
    {
        // Récupérer toutes les affiliations de l'employé
        $affiliationIds = $employe->affiliationsMutuelle()->pluck('id');

        // Récupérer toutes les opérations liées à ces affiliations
        $typeFilter = request('type');

        $operations = MutuelleOperation::with(['affiliation.mutuelle', 'documents'])
            ->whereIn('affiliation_id', $affiliationIds)
            ->when($typeFilter !== null && $typeFilter !== '', function ($q) use ($typeFilter) {
                $aliases = $this->typeAliases($typeFilter);
                $q->where(function ($sub) use ($aliases) {
                    foreach ($aliases as $alias) {
                        $sub->orWhere('type_operation', $alias);
                    }
                });
            })
            ->when(request('statut'), fn ($q) => $q->where('statut', request('statut')))
            ->when(request('date_operation_from') || request('date_operation_to'), function ($q) {
                $from = request('date_operation_from');
                $to = request('date_operation_to');
                if ($from && $to) {
                    $q->whereBetween('date_operation', [$from, $to]);
                } elseif ($from) {
                    $q->whereDate('date_operation', '>=', $from);
                } elseif ($to) {
                    $q->whereDate('date_operation', '<=', $to);
                }
            })
            ->when(request('date_remboursement_from') || request('date_remboursement_to'), function ($q) {
                $from = request('date_remboursement_from');
                $to = request('date_remboursement_to');
                if ($from && $to) {
                    $q->whereBetween('date_remboursement', [$from, $to]);
                } elseif ($from) {
                    $q->whereDate('date_remboursement', '>=', $from);
                } elseif ($to) {
                    $q->whereDate('date_remboursement', '<=', $to);
                }
            })
            ->orderByDesc('date_operation')
            ->orderByDesc('id')
            ->get();

        return response()->json($operations);
    }

    /**
     * Méthode de compatibilité : Créer une opération via un employé
     * POST /api/employes/{employe}/mutuelle-operations
     * Note : Nécessite affiliation_id dans le body
     */
    public function storeByEmploye(Request $request, Employe $employe)
    {
        // Valider que l'affiliation appartient bien à cet employé
        if ($request->has('affiliation_id')) {
            $affiliation = AffiliationMutuelle::where('id', $request->affiliation_id)
                ->where('employe_id', $employe->id)
                ->first();

            if (!$affiliation) {
                return response()->json([
                    'errors' => ['affiliation_id' => ['L\'affiliation n\'appartient pas à cet employé.']]
                ], 422);
            }
        } else {
            return response()->json([
                'errors' => ['affiliation_id' => ['L\'affiliation est requise.']]
            ], 422);
        }

        // Déléguer au store principal
        return $this->store($request);
    }
}
