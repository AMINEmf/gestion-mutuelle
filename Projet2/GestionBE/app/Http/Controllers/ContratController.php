<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Contrat;
use Illuminate\Http\Request;

class ContratController extends Controller
{
    public function index()
    {
        return response()->json(Contrat::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employe_id' => 'required|exists:employes,id',
            'numero_contrat' => 'nullable|string|max:255',
            'type_contrat' => 'nullable|string|max:255',
            'arret_prevu' => 'nullable|date',
            'duree_prevu' => 'nullable|string|max:255',
            'design' => 'nullable|string|max:255',
            'debut_le' => 'nullable|date',
            'arret_effectif' => 'nullable|date',
            'duree_effective' => 'nullable|string|max:255',
            'motif_depart' => 'nullable|string|max:255',
            'dernier_jour_travaille' => 'nullable|date',
            'notification_rupture' => 'nullable|date',
            'engagement_procedure' => 'nullable|date',
            'signature_rupture_conventionnelle' => 'nullable|date',
            'transaction_en_cours' => 'nullable|boolean',
        ]);

        $contrat = Contrat::create($data);
        return response()->json($contrat, 201);
    }

    public function show($id)
    {
        return response()->json(Contrat::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $contrat = Contrat::findOrFail($id);

        $data = $request->validate([
            'employe_id' => 'nullable|exists:employes,id',
            'numero_contrat' => 'nullable|string|max:255',
            'type_contrat' => 'nullable|string|max:255',
            'arret_prevu' => 'nullable|date',
            'duree_prevu' => 'nullable|string|max:255',
            'design' => 'nullable|string|max:255',
            'debut_le' => 'nullable|date',
            'arret_effectif' => 'nullable|date',
            'duree_effective' => 'nullable|string|max:255',
            'motif_depart' => 'nullable|string|max:255',
            'dernier_jour_travaille' => 'nullable|date',
            'notification_rupture' => 'nullable|date',
            'engagement_procedure' => 'nullable|date',
            'signature_rupture_conventionnelle' => 'nullable|date',
            'transaction_en_cours' => 'nullable|boolean',
        ]);

        $contrat->update($data);
        return response()->json($contrat);
    }

    public function destroy($id)
    {
        $contrat = Contrat::findOrFail($id);
        $contrat->delete();
        return response()->json(['message' => 'Contrat supprimé avec succès.']);
    }

    public function getContratsByEmploye($id)
    {
        $contrats = Contrat::where('employe_id', $id)->get();
        return response()->json($contrats);
    }
}



