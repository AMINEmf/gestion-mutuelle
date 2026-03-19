<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\GpBanque;
use Illuminate\Http\Request;

class GpBanqueController extends Controller
{
    public function index()
    {
        return response()->json(GpBanque::with('agences')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
        ]);
        $banque = GpBanque::create($data);
        return response()->json($banque, 201);
    }

    public function show($id)
    {
        return response()->json(GpBanque::with('agences')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $banque = GpBanque::findOrFail($id);
        $data = $request->validate([
            'nom' => 'required|string|max:255',
        ]);
        $banque->update($data);
        return response()->json($banque);
    }

    public function destroy($id)
    {
        GpBanque::findOrFail($id)->delete();
        return response()->json(['message' => 'Banque supprimée avec succès.']);
    }
}



