<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    public function index()
    {
        try {
            $services = Service::with(['departement', 'unites'])->get();
            return response()->json($services);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des services: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la récupération des services'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'departement_id' => 'required|exists:departements,id',
            ]);

            $service = Service::create($validated);
            return response()->json($service->load('departement'), 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du service: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la création du service'], 500);
        }
    }

    public function show($id)
    {
        try {
            $service = Service::with(['departement', 'unites'])->findOrFail($id);
            return response()->json($service);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Service non trouvé'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $service = Service::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'sometimes|string|max:255',
                'departement_id' => 'sometimes|exists:departements,id',
            ]);

            $service->update($validated);
            return response()->json($service->load('departement'));
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du service: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la mise à jour du service'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $service = Service::findOrFail($id);
            $service->delete();
            return response()->json(['message' => 'Service supprimé avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du service: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la suppression du service'], 500);
        }
    }

    public function getUnitesByService($id)
    {
        try {
            $service = Service::with('unites')->findOrFail($id);
            return response()->json($service->unites);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Service non trouvé'], 404);
        }
    }
}
