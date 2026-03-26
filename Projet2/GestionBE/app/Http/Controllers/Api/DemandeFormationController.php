<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeFormation;
use App\Models\Employe;
use App\Models\Formation;
use App\Models\FormationParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DemandeFormationController extends Controller
{
    public function index(Request $request)
    {
        $query = DemandeFormation::query()
            ->with([
                'employe:id,nom,prenom,matricule,poste_id,departement_id,manager_id',
                'employe.manager:id,nom,prenom',
                'manager:id,nom,prenom',
                'departement:id,nom',
            ])
            ->orderByDesc('created_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('formation_souhaitee', 'like', "%{$search}%")
                    ->orWhere('objectif', 'like', "%{$search}%")
                    ->orWhereHas('employe', function ($eq) use ($search) {
                        $eq->where('nom', 'like', "%{$search}%")
                            ->orWhere('prenom', 'like', "%{$search}%")
                            ->orWhere('matricule', 'like', "%{$search}%");
                    });
            });
        }

        if ($statut = $request->query('statut')) {
            $query->where('statut', $statut);
        }

        if ($urgence = $request->query('urgence')) {
            $query->where('urgence', $urgence);
        }

        if ($departementId = $request->query('departement_id')) {
            $query->where('departement_id', $departementId);
        }

        if ($dateFrom = $request->query('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->query('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        return response()->json($query->get()->map(fn (DemandeFormation $demande) => $this->transform($demande)));
    }

    public function show($id)
    {
        $demande = DemandeFormation::with([
            'employe:id,nom,prenom,matricule,poste_id,departement_id,manager_id',
            'employe.manager:id,nom,prenom',
            'manager:id,nom,prenom',
            'departement:id,nom',
        ])->findOrFail($id);

        return response()->json($this->transform($demande));
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);

        $employe = Employe::with(['departements:id,nom', 'manager:id,nom,prenom'])
            ->findOrFail($validated['employe_id']);

        $validated['manager_id'] = $validated['manager_id'] ?? $employe->manager_id;
        $validated['departement_id'] = $validated['departement_id'] ?? $employe->departement_id ?? optional($employe->departements->first())->id;
        $validated['statut'] = 'En étude';
        $validated['created_by'] = auth()->id();

        if ($request->hasFile('certificat')) {
            $file = $request->file('certificat');
            $validated['certificat_path'] = $file->store('formation/certificats', 'public');
        }

        $demande = DemandeFormation::create($validated);
        $demande->load(['employe:id,nom,prenom,matricule,poste_id,departement_id,manager_id', 'employe.manager:id,nom,prenom', 'manager:id,nom,prenom', 'departement:id,nom']);

        return response()->json([
            'message' => 'Demande de formation créée avec succès.',
            'data' => $this->transform($demande),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $demande = DemandeFormation::findOrFail($id);
        $validated = $this->validatePayload($request, true);

        if (array_key_exists('employe_id', $validated)) {
            $employe = Employe::with(['departements:id,nom', 'manager:id,nom,prenom'])
                ->findOrFail($validated['employe_id']);

            $validated['manager_id'] = $validated['manager_id'] ?? $employe->manager_id;
            $validated['departement_id'] = $validated['departement_id'] ?? $employe->departement_id ?? optional($employe->departements->first())->id;
        }

        if ($request->boolean('remove_certificat') && $demande->certificat_path) {
            Storage::disk('public')->delete($demande->certificat_path);
            $validated['certificat_path'] = null;
        }

        if ($request->hasFile('certificat')) {
            if ($demande->certificat_path) {
                Storage::disk('public')->delete($demande->certificat_path);
            }
            $file = $request->file('certificat');
            $validated['certificat_path'] = $file->store('formation/certificats', 'public');
        }

        $demande->update($validated);
        $demande->load(['employe:id,nom,prenom,matricule,poste_id,departement_id,manager_id', 'employe.manager:id,nom,prenom', 'manager:id,nom,prenom', 'departement:id,nom']);

        return response()->json([
            'message' => 'Demande de formation mise à jour avec succès.',
            'data' => $this->transform($demande),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $demande = DemandeFormation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'statut' => ['required', Rule::in(DemandeFormation::STATUTS)],
        ], [
            'statut.required' => 'Le statut est obligatoire.',
            'statut.in' => 'Le statut sélectionné est invalide.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données envoyées sont invalides.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $newStatut = $request->input('statut');
        $participantLinked = false;
        $alreadyRegistered = false;

        DB::transaction(function () use ($demande, $newStatut, &$participantLinked, &$alreadyRegistered) {
            $demande->update(['statut' => $newStatut]);

            if ($newStatut !== 'Validée') {
                return;
            }

            $formationTitle = trim((string) $demande->formation_souhaitee);
            $formation = Formation::query()
                ->where('titre', $formationTitle)
                ->first();

            if (!$formation) {
                abort(response()->json([
                    'message' => 'Impossible d’affecter le participant: la formation demandée est introuvable.',
                    'errors' => [
                        'formation_souhaitee' => ['La formation sélectionnée n’existe pas.'],
                    ],
                ], 422));
            }

            $participant = FormationParticipant::query()->firstOrCreate(
                [
                    'formation_id' => $formation->id,
                    'employe_id' => $demande->employe_id,
                ],
                [
                    'statut' => 'En attente',
                ]
            );

            if ($participant->wasRecentlyCreated) {
                $participantLinked = true;
                return;
            }

            $alreadyRegistered = true;
        });

        $demande->load(['employe:id,nom,prenom,matricule,poste_id,departement_id,manager_id', 'employe.manager:id,nom,prenom', 'manager:id,nom,prenom', 'departement:id,nom']);

        $message = 'Statut mis à jour avec succès.';
        if ($newStatut === 'Validée' && $participantLinked) {
            $message = 'Statut mis à jour avec succès. Le participant a été ajouté à la formation.';
        } elseif ($newStatut === 'Validée' && $alreadyRegistered) {
            $message = 'Statut mis à jour avec succès. Le participant était déjà inscrit à cette formation.';
        }

        return response()->json([
            'message' => $message,
            'data' => $this->transform($demande),
            'meta' => [
                'participant_linked' => $participantLinked,
                'already_registered' => $alreadyRegistered,
            ],
        ]);
    }

    public function destroy($id)
    {
        $demande = DemandeFormation::findOrFail($id);

        if ($demande->certificat_path) {
            Storage::disk('public')->delete($demande->certificat_path);
        }

        $demande->delete();

        return response()->json([
            'message' => 'Demande de formation supprimée avec succès.',
        ]);
    }

    private function validatePayload(Request $request, bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        $validator = Validator::make($request->all(), [
            'employe_id' => [$required, 'integer', 'exists:employes,id'],
            'manager_id' => ['nullable', 'integer', 'exists:employes,id'],
            'departement_id' => ['nullable', 'integer', 'exists:departements,id'],
            'formation_souhaitee' => [$required, 'string', 'max:255'],
            'objectif' => [$required, 'string'],
            'lien_poste' => ['nullable', 'string'],
            'urgence' => [$required, Rule::in(DemandeFormation::URGENCES)],
            'cout_estime' => ['nullable', 'numeric', 'min:0'],
            'source_demande' => ['nullable', Rule::in(DemandeFormation::SOURCES_DEMANDE)],
            'commentaire_rh' => ['nullable', 'string'],
            'organisation_formation' => ['nullable', 'string'],
            'inscription' => ['nullable', 'string'],
            'suivi_participation' => ['nullable', 'string'],
            'resultat' => ['nullable', 'string'],
            'statut' => ['sometimes', Rule::in(DemandeFormation::STATUTS)],
            'certificat' => ['nullable', 'file', 'mimes:pdf,doc,docx,png,jpg,jpeg', 'max:8192'],
            'remove_certificat' => ['nullable', 'boolean'],
        ], [
            'employe_id.required' => 'L’employé est obligatoire.',
            'employe_id.exists' => 'L’employé sélectionné est introuvable.',
            'formation_souhaitee.required' => 'La formation souhaitée est obligatoire.',
            'objectif.required' => 'L’objectif est obligatoire.',
            'urgence.required' => 'Le niveau d’urgence est obligatoire.',
            'urgence.in' => 'Le niveau d’urgence sélectionné est invalide.',
            'source_demande.in' => 'La source de la demande est invalide.',
            'statut.in' => 'Le statut sélectionné est invalide.',
            'certificat.mimes' => 'Le certificat doit être un fichier PDF, DOC, DOCX, PNG ou JPG.',
            'certificat.max' => 'Le certificat ne doit pas dépasser 8 Mo.',
        ]);

        if ($validator->fails()) {
            abort(response()->json([
                'message' => 'Les données envoyées sont invalides.',
                'errors' => $validator->errors(),
            ], 422));
        }

        return $validator->validated();
    }

    private function transform(DemandeFormation $demande): array
    {
        $employe = $demande->employe;
        $manager = $demande->manager ?: $employe?->manager;
        $departement = $demande->departement;

        $certificatUrl = null;
        if ($demande->certificat_path) {
            $certificatUrl = Storage::disk('public')->url($demande->certificat_path);
        }

        return [
            'id' => $demande->id,
            'employe_id' => $demande->employe_id,
            'employe_nom_complet' => $employe ? trim(($employe->nom ?? '') . ' ' . ($employe->prenom ?? '')) : null,
            'matricule' => $employe?->matricule,
            'departement_id' => $demande->departement_id,
            'departement_nom' => $departement?->nom,
            'manager_id' => $demande->manager_id,
            'manager_nom_complet' => $manager ? trim(($manager->nom ?? '') . ' ' . ($manager->prenom ?? '')) : null,
            'formation_souhaitee' => $demande->formation_souhaitee,
            'objectif' => $demande->objectif,
            'lien_poste' => $demande->lien_poste,
            'urgence' => $demande->urgence,
            'cout_estime' => $demande->cout_estime,
            'source_demande' => $demande->source_demande,
            'commentaire_rh' => $demande->commentaire_rh,
            'organisation_formation' => $demande->organisation_formation,
            'inscription' => $demande->inscription,
            'suivi_participation' => $demande->suivi_participation,
            'resultat' => $demande->resultat,
            'certificat_path' => $demande->certificat_path,
            'certificat_url' => $certificatUrl,
            'statut' => $demande->statut,
            'created_by' => $demande->created_by,
            'created_at' => optional($demande->created_at)->toDateTimeString(),
            'updated_at' => optional($demande->updated_at)->toDateTimeString(),
        ];
    }
}
