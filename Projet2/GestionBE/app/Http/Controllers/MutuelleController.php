<?php

namespace App\Http\Controllers;

use App\Models\Mutuelle;
use App\Models\RegimeMutuelle;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MutuelleController extends Controller
{
    /**
     * GET /api/mutuelles
     * Retourne les mutuelles actives pour les selects
     */
    public function index(Request $request)
    {
        try {
            $query = Mutuelle::query();

            // Par défaut, retourner seulement les mutuelles actives
            if ($request->get('active', true)) {
                $query->where('active', true);
            }

            $mutuelles = $query->select('id', 'nom', 'active')
                              ->orderBy('nom')
                              ->get();

            return response()->json([
                'success' => true,
                'data' => $mutuelles
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des mutuelles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/mutuelles/{mutuelle_id}/regimes
     * Retourne les régimes actifs d'une mutuelle
     */
    public function regimes($mutuelleId)
    {
        try {
            $mutuelle = Mutuelle::findOrFail($mutuelleId);

            $regimes = RegimeMutuelle::where('mutuelle_id', $mutuelleId)
                ->where('active', true)
                ->select('id', 'libelle', 'taux_couverture', 'cotisation_mensuelle', 'part_employeur_pct', 'part_employe_pct')
                ->orderBy('libelle')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $regimes,
                'mutuelle' => $mutuelle->nom
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des régimes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/mutuelles
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255|unique:mutuelles,nom',
                'active' => 'boolean'
            ]);

            $mutuelle = Mutuelle::create($validated);

            return response()->json([
                'success' => true,
                'data' => $mutuelle,
                'message' => 'Mutuelle créée avec succès'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la mutuelle',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/mutuelles/{id}
     */
    public function show(string $id)
    {
        try {
            $mutuelle = Mutuelle::with('regimes')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $mutuelle
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Mutuelle non trouvée',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * PUT /api/mutuelles/{id}
     */
    public function update(Request $request, string $id)
    {
        try {
            $mutuelle = Mutuelle::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'required|string|max:255|unique:mutuelles,nom,' . $id,
                'active' => 'boolean'
            ]);

            $mutuelle->update($validated);

            return response()->json([
                'success' => true,
                'data' => $mutuelle,
                'message' => 'Mutuelle mise à jour avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la mutuelle',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/mutuelles/{id}
     */
    public function destroy(string $id)
    {
        try {
            $mutuelle = Mutuelle::findOrFail($id);

            // Vérifier s'il y a des affiliations actives
            $affiliationsActives = $mutuelle->affiliations()->where('statut', 'ACTIVE')->count();
            
            if ($affiliationsActives > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer cette mutuelle car elle a des affiliations actives'
                ], 400);
            }

            $mutuelle->delete();

            return response()->json([
                'success' => true,
                'message' => 'Mutuelle supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la mutuelle',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
