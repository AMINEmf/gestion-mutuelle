<?php

namespace App\Http\Controllers;

use App\Models\TypeEvolution;
use Illuminate\Http\Request;

class TypeEvolutionController extends Controller
{
    /**
     * List all types d'évolution.
     */
    public function index()
    {
        return response()->json(TypeEvolution::orderBy('name')->get());
    }

    /**
     * Create a new type d'évolution.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:types_evolution,name',
        ]);

        $type = TypeEvolution::create([
            'name' => trim($request->input('name')),
        ]);

        return response()->json($type, 201);
    }

    /**
     * Update an existing type d'évolution.
     */
    public function update(Request $request, $id)
    {
        $type = TypeEvolution::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:types_evolution,name,' . $type->id,
        ]);

        $type->update([
            'name' => trim($request->input('name')),
        ]);

        return response()->json($type);
    }

    /**
     * Delete a type d'évolution.
     */
    public function destroy($id)
    {
        $type = TypeEvolution::findOrFail($id);
        $type->delete();

        return response()->json(['message' => 'Type supprimé'], 200);
    }
}
