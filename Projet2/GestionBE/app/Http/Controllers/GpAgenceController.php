<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\GpAgence;
use Illuminate\Http\Request;

class GpAgenceController extends Controller
{
    public function index(Request $request)
    {
        $query = GpAgence::with('banque');
        if ($request->filled('banque_id')) {
            $query->where('banque_id', $request->banque_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'banque_id' => 'required|exists:gp_banques,id',
        ]);
        $agence = GpAgence::create($data);
        return response()->json($agence, 201);
    }

    public function show($id)
    {
        return response()->json(GpAgence::with('banque')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $agence = GpAgence::findOrFail($id);
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'banque_id' => 'nullable|exists:gp_banques,id',
        ]);
        $agence->update($data);
        return response()->json($agence);
    }

    public function destroy($id)
    {
        GpAgence::findOrFail($id)->delete();
        return response()->json(['message' => 'Agence supprimée avec succès.']);
    }
}



