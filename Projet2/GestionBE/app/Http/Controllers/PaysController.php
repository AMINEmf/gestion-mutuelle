<?php

namespace App\Http\Controllers;

use App\Models\Commune;
use App\Models\Pays;
use App\Models\Ville;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaysController extends Controller
{
    public function getFullData(Request $request)
    {
        try {
            $pays = Pays::orderBy('nom')->get(['id', 'nom', 'code_pays']);
            $villes = Ville::orderBy('nom')->get(['id', 'nom', 'pays_id']);
            $communes = Commune::orderBy('nom')->get(['id', 'nom', 'ville_id']);

            return response()->json([
                'pays' => $pays,
                'villes' => $villes,
                'communes' => $communes,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des données géographiques', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Impossible de charger les données géographiques',
            ], 500);
        }
    }
}
