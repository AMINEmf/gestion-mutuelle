<?php

namespace App\Http\Controllers;

use App\Models\Mutuelle;
use App\Models\RegimeMutuelle;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RegimeMutuelleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = RegimeMutuelle::query()->with('mutuelle:id,nom');

        if ($request->filled('mutuelle_id')) {
            $query->where('mutuelle_id', $request->input('mutuelle_id'));
        }

        if ($request->boolean('active', false)) {
            $query->active();
        }

        $regimes = $query
            ->orderBy('libelle')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $regimes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $this->validateData($request);

            $regime = RegimeMutuelle::create($validated);

            return response()->json([
                'success' => true,
                'data' => $regime,
                'message' => 'Régime créé avec succès'
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du régime',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $regime = RegimeMutuelle::with('mutuelle:id,nom')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $regime
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $regime = RegimeMutuelle::findOrFail($id);
            $validated = $this->validateData($request, $regime->id, $regime->mutuelle_id);

            $regime->update($validated);

            return response()->json([
                'success' => true,
                'data' => $regime,
                'message' => 'Régime mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du régime',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $regime = RegimeMutuelle::findOrFail($id);

        if ($regime->affiliations()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce régime car il est associé à des affiliations actives'
            ], Response::HTTP_BAD_REQUEST);
        }

        $regime->delete();

        return response()->json([
            'success' => true,
            'message' => 'Régime supprimé avec succès'
        ]);
    }

    /**
     * GET /api/regimes-mutuelle/mutuelle/{mutuelle_id}
     */
    public function getByMutuelle($mutuelleId)
    {
        $mutuelle = Mutuelle::findOrFail($mutuelleId);

        $regimes = RegimeMutuelle::where('mutuelle_id', $mutuelleId)
            ->when(request()->boolean('active', true), function ($query) {
                $query->active();
            })
            ->orderBy('libelle')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $regimes,
            'mutuelle' => $mutuelle->nom
        ]);
    }

    /**
     * Routes imbriquées : /api/mutuelles/{mutuelle_id}/regimes
     */
    public function storeForMutuelle(Request $request, $mutuelleId)
    {
        $request->merge(['mutuelle_id' => $mutuelleId]);
        return $this->store($request);
    }

    public function updateForMutuelle(Request $request, $mutuelleId, string $id)
    {
        $request->merge(['mutuelle_id' => $mutuelleId]);
        // Vérifie que le régime appartient bien à la mutuelle
        RegimeMutuelle::where('id', $id)->where('mutuelle_id', $mutuelleId)->firstOrFail();
        return $this->update($request, $id);
    }

    public function destroyForMutuelle($mutuelleId, string $id)
    {
        $regime = RegimeMutuelle::where('id', $id)->where('mutuelle_id', $mutuelleId)->firstOrFail();
        return $this->destroy($regime->id);
    }

    /**
     * Validation commune (store & update)
     */
    private function validateData(Request $request, $regimeId = null, $mutuelleId = null)
    {
        $mutuelleId = $mutuelleId ?? $request->input('mutuelle_id');

        $validated = $request->validate([
            'mutuelle_id' => ['required', 'exists:mutuelles,id'],
            'libelle' => ['required', 'string', 'max:255'],
            'taux_couverture' => ['nullable', 'integer', 'min:0', 'max:100'],
            'cotisation_mensuelle' => ['nullable', 'numeric', 'min:0'],
            'part_employeur_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'part_employe_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'active' => ['sometimes', 'boolean'],
        ]);

        // Forcer la mutuelle si route imbriquée
        if ($mutuelleId) {
            $validated['mutuelle_id'] = $mutuelleId;
        }

        if (!array_key_exists('active', $validated)) {
            $validated['active'] = true;
        }

        return $validated;
    }
}
