<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\AffiliationMutuelle;
use App\Models\MutuelleOperation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

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
            'date_operation' => 'required|date',
            'date_depot' => 'nullable|date',
            'date_remboursement' => 'nullable|date',
            'type_operation' => ['required', 'string', Rule::in($this->typeOptions)],
            'statut' => ['required', 'string', Rule::in($this->statutOptions)],
            'montant_total' => 'required|numeric|min:0',
            'montant_rembourse' => 'nullable|numeric|min:0',
            'commentaire' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // Validation du bénéficiaire selon l'affiliation
        $affiliation = AffiliationMutuelle::find($validated['affiliation_id']);
        
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

        // Calcul reste à charge
        $montantRembourse = $validated['montant_rembourse'] ?? 0;
        $resteACharge = max($validated['montant_total'] - $montantRembourse, 0);

        $operation = MutuelleOperation::create([
            'affiliation_id' => $validated['affiliation_id'],
            'numero_dossier' => $validated['numero_dossier'] ?? null,
            'beneficiaire_type' => $validated['beneficiaire_type'],
            'beneficiaire_nom' => $validated['beneficiaire_nom'] ?? null,
            'date_operation' => $validated['date_operation'],
            'date_depot' => $validated['date_depot'] ?? null,
            'date_remboursement' => $validated['date_remboursement'] ?? null,
            'type_operation' => $validated['type_operation'],
            'statut' => $validated['statut'],
            'montant_total' => $validated['montant_total'],
            'montant_rembourse' => $montantRembourse,
            'reste_a_charge' => $resteACharge,
            'commentaire' => $validated['commentaire'] ?? null,
        ]);

        return response()->json($operation->load(['affiliation.employe', 'affiliation.mutuelle']), 201);
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
            'date_operation' => 'sometimes|date',
            'date_depot' => 'nullable|date',
            'date_remboursement' => 'nullable|date',
            'type_operation' => ['sometimes', 'string', Rule::in($this->typeOptions)],
            'statut' => ['sometimes', 'string', Rule::in($this->statutOptions)],
            'montant_total' => 'sometimes|numeric|min:0',
            'montant_rembourse' => 'nullable|numeric|min:0',
            'commentaire' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // Validation du bénéficiaire si changement
        if (isset($validated['beneficiaire_type'])) {
            $affiliation = $operation->affiliation;
            
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

        // Recalculer reste à charge si changement des montants
        if (isset($validated['montant_total']) || isset($validated['montant_rembourse'])) {
            $montantTotal = $validated['montant_total'] ?? $operation->montant_total;
            $montantRembourse = $validated['montant_rembourse'] ?? $operation->montant_rembourse;
            $validated['reste_a_charge'] = max($montantTotal - $montantRembourse, 0);
        }

        $operation->update($validated);

        return response()->json($operation->load(['affiliation.employe', 'affiliation.mutuelle']));
    }

    /**
     * Supprimer une opération
     */
    public function destroy(MutuelleOperation $operation)
    {
        if ($operation->statut === 'REMBOURSEE') {
            return response()->json(['message' => 'Opération remboursée non supprimable'], 403);
        }

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
        $operations = MutuelleOperation::with(['affiliation.mutuelle'])
            ->whereIn('affiliation_id', $affiliationIds)
            ->orderByDesc('date_operation')
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
