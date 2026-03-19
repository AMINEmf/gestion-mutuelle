<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeMobilite;
use App\Models\Employe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DemandeMobiliteController extends Controller
{
    public function index(Request $request)
    {
        $query = DemandeMobilite::query()
            ->with(['employe:id,nom,prenom,matricule,poste_id,departement_id', 'employe.poste:id,nom', 'employe.departements:id,nom'])
            ->orderByDesc('created_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('poste_souhaite', 'like', "%{$search}%")
                    ->orWhere('poste_actuel', 'like', "%{$search}%")
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

        if ($typeMobilite = $request->query('type_mobilite')) {
            $query->where('type_mobilite', $typeMobilite);
        }

        if ($departementId = $request->query('departement_id')) {
            $query->whereHas('employe', function ($q) use ($departementId) {
                $q->where('departement_id', $departementId)
                    ->orWhereHas('departements', function ($dq) use ($departementId) {
                        $dq->where('departement_id', $departementId);
                    });
            });
        }

        if ($dateFrom = $request->query('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->query('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        return response()->json($query->get()->map(fn (DemandeMobilite $demande) => $this->transform($demande)));
    }

    public function show($id)
    {
        $demande = DemandeMobilite::with(['employe:id,nom,prenom,matricule,poste_id,departement_id', 'employe.poste:id,nom', 'employe.departements:id,nom'])
            ->findOrFail($id);

        return response()->json($this->transform($demande));
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);

        $employe = Employe::with(['poste:id,nom', 'departements:id,nom'])->findOrFail($validated['employe_id']);

        if (empty($validated['poste_actuel'])) {
            $validated['poste_actuel'] = $employe->poste?->nom;
        }
        if (empty($validated['departement_actuel'])) {
            $validated['departement_actuel'] = optional($employe->departements->first())->nom;
        }

        $validated['statut'] = 'En étude';
        $validated['created_by'] = auth()->id();

        if ($request->hasFile('cv_interne')) {
            $file = $request->file('cv_interne');
            $validated['cv_interne_path'] = $file->store('mobilite/cv', 'public');
            $validated['cv_interne_nom_original'] = $file->getClientOriginalName();
        }

        $demande = DemandeMobilite::create($validated);
        $demande->load(['employe:id,nom,prenom,matricule,poste_id,departement_id', 'employe.poste:id,nom', 'employe.departements:id,nom']);

        return response()->json([
            'message' => 'Demande de mobilité créée avec succès.',
            'data' => $this->transform($demande),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $demande = DemandeMobilite::findOrFail($id);
        $validated = $this->validatePayload($request, true);

        $employe = null;
        if (array_key_exists('employe_id', $validated)) {
            $employe = Employe::with(['poste:id,nom', 'departements:id,nom'])->findOrFail($validated['employe_id']);
            if (empty($validated['poste_actuel'])) {
                $validated['poste_actuel'] = $employe->poste?->nom;
            }
            if (empty($validated['departement_actuel'])) {
                $validated['departement_actuel'] = optional($employe->departements->first())->nom;
            }
        }

        if ($request->boolean('remove_cv_interne') && $demande->cv_interne_path) {
            Storage::disk('public')->delete($demande->cv_interne_path);
            $validated['cv_interne_path'] = null;
            $validated['cv_interne_nom_original'] = null;
        }

        if ($request->hasFile('cv_interne')) {
            if ($demande->cv_interne_path) {
                Storage::disk('public')->delete($demande->cv_interne_path);
            }
            $file = $request->file('cv_interne');
            $validated['cv_interne_path'] = $file->store('mobilite/cv', 'public');
            $validated['cv_interne_nom_original'] = $file->getClientOriginalName();
        }

        $demande->update($validated);
        $demande->load(['employe:id,nom,prenom,matricule,poste_id,departement_id', 'employe.poste:id,nom', 'employe.departements:id,nom']);

        return response()->json([
            'message' => 'Demande de mobilité mise à jour avec succès.',
            'data' => $this->transform($demande),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $demande = DemandeMobilite::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'statut' => ['required', Rule::in(DemandeMobilite::STATUTS)],
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

        $demande->update(['statut' => $request->input('statut')]);
        $demande->load(['employe:id,nom,prenom,matricule,poste_id,departement_id', 'employe.poste:id,nom', 'employe.departements:id,nom']);

        return response()->json([
            'message' => 'Statut mis à jour avec succès.',
            'data' => $this->transform($demande),
        ]);
    }

    public function destroy($id)
    {
        $demande = DemandeMobilite::findOrFail($id);

        if ($demande->cv_interne_path) {
            Storage::disk('public')->delete($demande->cv_interne_path);
        }

        $demande->delete();

        return response()->json([
            'message' => 'Demande de mobilité supprimée avec succès.',
        ]);
    }

    private function validatePayload(Request $request, bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        $validator = Validator::make($request->all(), [
            'employe_id' => [$required, 'integer', 'exists:employes,id'],
            'poste_actuel' => ['nullable', 'string', 'max:255'],
            'departement_actuel' => ['nullable', 'string', 'max:255'],
            'poste_souhaite' => [$required, 'string', 'max:255'],
            'type_mobilite' => [$required, Rule::in(DemandeMobilite::TYPES_MOBILITE)],
            'source_demande' => ['nullable', Rule::in(DemandeMobilite::SOURCES_DEMANDE)],
            'motivation' => [$required, 'string'],
            'disponibilite' => ['nullable', 'date'],
            'avis_manager' => ['nullable', 'string'],
            'compatibilite_profil_poste' => ['nullable', 'string', 'max:255'],
            'besoin_formation' => ['nullable', 'boolean'],
            'details_formation' => ['nullable', 'string'],
            'disponibilite_poste' => ['nullable', Rule::in(DemandeMobilite::DISPONIBILITE_POSTE_VALUES)],
            'impact_organisationnel' => ['nullable', 'string'],
            'commentaire_rh' => ['nullable', 'string'],
            'statut' => ['sometimes', Rule::in(DemandeMobilite::STATUTS)],
            'rh_responsable' => ['nullable', 'string', 'max:255'],
            'cv_interne' => ['nullable', 'file', 'mimes:pdf,doc,docx,png,jpg,jpeg', 'max:8192'],
            'remove_cv_interne' => ['nullable', 'boolean'],
        ], [
            'employe_id.required' => 'L’employé concerné est obligatoire.',
            'employe_id.exists' => 'L’employé sélectionné est introuvable.',
            'poste_souhaite.required' => 'Le poste souhaité est obligatoire.',
            'type_mobilite.required' => 'Le type de mobilité est obligatoire.',
            'type_mobilite.in' => 'Le type de mobilité sélectionné est invalide.',
            'motivation.required' => 'La motivation est obligatoire.',
            'source_demande.in' => 'La source de la demande est invalide.',
            'disponibilite.date' => 'La date de disponibilité est invalide.',
            'disponibilite_poste.in' => 'La disponibilité du poste est invalide.',
            'statut.in' => 'Le statut sélectionné est invalide.',
            'cv_interne.file' => 'Le document CV interne est invalide.',
            'cv_interne.mimes' => 'Le document doit être un fichier PDF, DOC, DOCX, PNG ou JPG.',
            'cv_interne.max' => 'Le document ne doit pas dépasser 8 Mo.',
        ]);

        if ($validator->fails()) {
            abort(response()->json([
                'message' => 'Les données envoyées sont invalides.',
                'errors' => $validator->errors(),
            ], 422));
        }

        return $validator->validated();
    }

    private function transform(DemandeMobilite $demande): array
    {
        $employe = $demande->employe;

        $cvUrl = null;
        if ($demande->cv_interne_path) {
            $cvUrl = Storage::disk('public')->url($demande->cv_interne_path);
        }

        $departementNom = $demande->departement_actuel ?: optional($employe?->departements?->first())->nom;

        return [
            'id' => $demande->id,
            'employe_id' => $demande->employe_id,
            'employe_nom_complet' => $employe ? trim(($employe->nom ?? '') . ' ' . ($employe->prenom ?? '')) : null,
            'matricule' => $employe?->matricule,
            'departement_id' => $employe?->departement_id,
            'departement_nom' => $departementNom,
            'poste_actuel' => $demande->poste_actuel ?: ($employe?->poste?->nom ?? null),
            'poste_souhaite' => $demande->poste_souhaite,
            'type_mobilite' => $demande->type_mobilite,
            'source_demande' => $demande->source_demande,
            'motivation' => $demande->motivation,
            'disponibilite' => optional($demande->disponibilite)->format('Y-m-d'),
            'avis_manager' => $demande->avis_manager,
            'compatibilite_profil_poste' => $demande->compatibilite_profil_poste,
            'besoin_formation' => $demande->besoin_formation,
            'details_formation' => $demande->details_formation,
            'disponibilite_poste' => $demande->disponibilite_poste,
            'impact_organisationnel' => $demande->impact_organisationnel,
            'commentaire_rh' => $demande->commentaire_rh,
            'statut' => $demande->statut,
            'rh_responsable' => $demande->rh_responsable,
            'cv_interne_path' => $demande->cv_interne_path,
            'cv_interne_nom_original' => $demande->cv_interne_nom_original,
            'cv_interne_url' => $cvUrl,
            'created_by' => $demande->created_by,
            'created_at' => optional($demande->created_at)->toDateTimeString(),
            'updated_at' => optional($demande->updated_at)->toDateTimeString(),
        ];
    }
}
