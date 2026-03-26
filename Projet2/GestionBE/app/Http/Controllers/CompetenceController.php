<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompetenceRequest;
use App\Http\Requests\UpdateCompetenceRequest;
use App\Models\GpCompetence;
use Illuminate\Http\Request;

class CompetenceController extends Controller
{
    public function index(Request $request)
    {
        $query = GpCompetence::query();

        if ($search = $request->query('search')) {
            $query->where('nom', 'like', "%{$search}%");
        }

        if ($categorie = $request->query('categorie')) {
            $query->where('categorie', $categorie);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $competence = GpCompetence::findOrFail($id);

        return response()->json($competence);
    }

    public function store(StoreCompetenceRequest $request)
    {
        $competence = GpCompetence::create($request->validated());

        return response()->json($competence, 201);
    }

    public function update(UpdateCompetenceRequest $request, $id)
    {
        $competence = GpCompetence::findOrFail($id);
        $competence->update($request->validated());

        return response()->json($competence);
    }

    public function destroy($id)
    {
        $competence = GpCompetence::findOrFail($id);
        $competence->delete();

        return response()->json(null, 204);
    }
}
