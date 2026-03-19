<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class FormateurController extends Controller
{
    /**
     * List all formateurs (external trainers).
     */
    public function index()
    {
        // Vérifier que la table existe avant d'interroger (migration peut ne pas avoir tourné)
        if (!Schema::hasTable('formateurs')) {
            return response()->json([]);
        }
        return response()->json(Formateur::orderBy('name')->get());
    }

    /**
     * Create a new formateur.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:formateurs,name',
        ]);

        $formateur = Formateur::create([
            'name' => trim($request->input('name')),
        ]);

        return response()->json($formateur, 201);
    }

    /**
     * Update an existing formateur.
     */
    public function update(Request $request, $id)
    {
        $formateur = Formateur::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:formateurs,name,' . $formateur->id,
        ]);

        $formateur->update([
            'name' => trim($request->input('name')),
        ]);

        return response()->json($formateur);
    }

    /**
     * Delete a formateur.
     */
    public function destroy($id)
    {
        $formateur = Formateur::findOrFail($id);
        $formateur->delete();

        return response()->json(['message' => 'Formateur supprimé']);
    }
}
