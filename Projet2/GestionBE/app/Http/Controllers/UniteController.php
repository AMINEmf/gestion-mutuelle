<?php

namespace App\Http\Controllers;

use App\Models\Unite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UniteController extends Controller
{
    public function index()
    {
        try {
            $unites = Unite::with(['service', 'departement', 'postes'])->get();
            return response()->json($unites);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des unités: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la récupération des unités'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'service_id' => 'required|exists:gp_services,id',
                'departement_id' => 'required|exists:departements,id',
            ]);

            $unite = Unite::create($validated);
            return response()->json($unite->load(['service', 'departement']), 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de l\'unité: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la création de l\'unité'], 500);
        }
    }

    public function show($id)
    {
        try {
            $unite = Unite::with(['service', 'departement', 'postes'])->findOrFail($id);
            return response()->json($unite);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unité non trouvée'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $unite = Unite::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'sometimes|string|max:255',
                'service_id' => 'sometimes|exists:gp_services,id',
                'departement_id' => 'sometimes|exists:departements,id',
            ]);

            $unite->update($validated);
            return response()->json($unite->load(['service', 'departement']));
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de l\'unité: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la mise à jour de l\'unité'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $unite = Unite::findOrFail($id);
            $unite->delete();
            return response()->json(['message' => 'Unité supprimée avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de l\'unité: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la suppression de l\'unité'], 500);
        }
    }
}
