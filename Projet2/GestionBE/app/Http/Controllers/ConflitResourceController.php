<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConflitLieu;
use App\Models\ConflitType;
use App\Models\ConflitStatut;

class ConflitResourceController extends Controller
{
    // ==================== LIEUX ====================
    public function indexLieux()
    {
        return ConflitLieu::orderBy('nom')->get();
    }

    public function storeLieu(Request $request)
    {
        $request->validate(['nom' => 'required|string|max:255']);
        return ConflitLieu::create(['nom' => $request->nom]);
    }

    public function updateLieu(Request $request, $id)
    {
        $request->validate(['nom' => 'required|string|max:255']);
        $lieu = ConflitLieu::findOrFail($id);
        $lieu->update(['nom' => $request->nom]);
        return $lieu;
    }

    public function destroyLieu($id)
    {
        $lieu = ConflitLieu::findOrFail($id);
        $lieu->delete();
        return response()->json(['message' => 'Lieu supprimé']);
    }

    // ==================== TYPES ====================
    public function indexTypes()
    {
        return ConflitType::orderBy('nom')->get();
    }

    public function storeType(Request $request)
    {
        $request->validate(['nom' => 'required|string|max:255']);
        return ConflitType::create(['nom' => $request->nom]);
    }

    public function updateType(Request $request, $id)
    {
        $request->validate(['nom' => 'required|string|max:255']);
        $type = ConflitType::findOrFail($id);
        $type->update(['nom' => $request->nom]);
        return $type;
    }

    public function destroyType($id)
    {
        $type = ConflitType::findOrFail($id);
        $type->delete();
        return response()->json(['message' => 'Type supprimé']);
    }

    // ==================== STATUTS ====================
    public function indexStatuts()
    {
        return ConflitStatut::orderBy('id')->get();
    }

    public function storeStatut(Request $request)
    {
        $request->validate(['nom' => 'required|string|max:255']);
        return ConflitStatut::create(['nom' => $request->nom]);
    }

    public function updateStatut(Request $request, $id)
    {
        $request->validate(['nom' => 'required|string|max:255']);
        $statut = ConflitStatut::findOrFail($id);
        $statut->update(['nom' => $request->nom]);
        return $statut;
    }

    public function destroyStatut($id)
    {
        $statut = ConflitStatut::findOrFail($id);
        $statut->delete();
        return response()->json(['message' => 'Statut supprimé']);
    }
}
