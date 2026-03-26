<?php

namespace App\Http\Controllers;

use App\Models\SanctionType;
use App\Models\SanctionGravite;
use App\Models\SanctionStatut;
use Illuminate\Http\Request;

class SanctionResourceController extends Controller
{
    // ============ TYPES ============
    public function indexTypes()
    {
        return SanctionType::orderBy('nom')->get();
    }

    public function storeType(Request $request)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255', 'unique:sanction_types,nom'],
        ]);

        $type = SanctionType::create($validated);
        return response()->json($type, 201);
    }

    public function updateType(Request $request, SanctionType $sanction_type)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255', 'unique:sanction_types,nom,' . $sanction_type->id],
        ]);

        $sanction_type->update($validated);
        return response()->json($sanction_type);
    }

    public function destroyType(SanctionType $sanction_type)
    {
        $sanction_type->delete();
        return response()->noContent();
    }

    // ============ GRAVITES ============
    public function indexGravites()
    {
        return SanctionGravite::orderBy('id')->get();
    }

    public function storeGravite(Request $request)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255', 'unique:sanction_gravites,nom'],
        ]);

        $gravite = SanctionGravite::create($validated);
        return response()->json($gravite, 201);
    }

    public function updateGravite(Request $request, SanctionGravite $sanction_gravite)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255', 'unique:sanction_gravites,nom,' . $sanction_gravite->id],
        ]);

        $sanction_gravite->update($validated);
        return response()->json($sanction_gravite);
    }

    public function destroyGravite(SanctionGravite $sanction_gravite)
    {
        $sanction_gravite->delete();
        return response()->noContent();
    }

    // ============ STATUTS ============
    public function indexStatuts()
    {
        return SanctionStatut::orderBy('id')->get();
    }

    public function storeStatut(Request $request)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255', 'unique:sanction_statuts,nom'],
        ]);

        $statut = SanctionStatut::create($validated);
        return response()->json($statut, 201);
    }

    public function updateStatut(Request $request, SanctionStatut $sanction_statut)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255', 'unique:sanction_statuts,nom,' . $sanction_statut->id],
        ]);

        $sanction_statut->update($validated);
        return response()->json($sanction_statut);
    }

    public function destroyStatut(SanctionStatut $sanction_statut)
    {
        $sanction_statut->delete();
        return response()->noContent();
    }
}
