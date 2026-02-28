<?php

namespace App\Http\Controllers;

use App\Models\Sanction;
use App\Models\SanctionDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SanctionController extends Controller
{
    public function index()
    {
        return Sanction::with(['type', 'gravite', 'statut', 'departement', 'conflit', 'documents'])
            ->orderByDesc('date_sanction')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employe' => ['required', 'string', 'max:255'],
            'matricule' => ['required', 'string', 'max:255'],
            'date_sanction' => ['required', 'date'],
            'reference_dossier' => ['nullable', 'string', 'max:255'],
            'departement_id' => ['nullable', 'exists:departements,id'],
            'sanction_type_id' => ['required', 'exists:sanction_types,id'],
            'motif_description' => ['nullable', 'string'],
            'rappel_faits' => ['nullable', 'string'],
            'conflit_id' => ['nullable', 'exists:conflits,id'],
            'sanction_gravite_id' => ['nullable', 'exists:sanction_gravites,id'],
            'duree_jours' => ['nullable', 'integer', 'min:0'],
            'impact_salaire' => ['boolean'],
            'montant_impact' => ['nullable', 'numeric', 'min:0'],
            'date_effet' => ['nullable', 'date'],
            'date_fin' => ['nullable', 'date'],
            'sanction_statut_id' => ['required', 'exists:sanction_statuts,id'],
            'commentaires_rh' => ['nullable', 'string'],
        ]);

        $sanction = Sanction::create($validated);

        // Handle file uploads
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->store('sanctions', 'public');
                SanctionDocument::create([
                    'sanction_id' => $sanction->id,
                    'nom' => $file->getClientOriginalName(),
                    'chemin' => $path,
                    'type' => $request->input('document_type', 'autre'),
                ]);
            }
        }

        return response()->json($sanction->load(['type', 'gravite', 'statut', 'departement', 'conflit', 'documents']), 201);
    }

    public function show(Sanction $sanction)
    {
        return $sanction->load(['type', 'gravite', 'statut', 'departement', 'conflit', 'documents']);
    }

    public function update(Request $request, Sanction $sanction)
    {
        $validated = $request->validate([
            'employe' => ['sometimes', 'required', 'string', 'max:255'],
            'matricule' => ['sometimes', 'required', 'string', 'max:255'],
            'date_sanction' => ['sometimes', 'required', 'date'],
            'reference_dossier' => ['sometimes', 'nullable', 'string', 'max:255'],
            'departement_id' => ['sometimes', 'nullable', 'exists:departements,id'],
            'sanction_type_id' => ['sometimes', 'required', 'exists:sanction_types,id'],
            'motif_description' => ['sometimes', 'nullable', 'string'],
            'rappel_faits' => ['sometimes', 'nullable', 'string'],
            'conflit_id' => ['sometimes', 'nullable', 'exists:conflits,id'],
            'sanction_gravite_id' => ['sometimes', 'nullable', 'exists:sanction_gravites,id'],
            'duree_jours' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'impact_salaire' => ['sometimes', 'boolean'],
            'montant_impact' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'date_effet' => ['sometimes', 'nullable', 'date'],
            'date_fin' => ['sometimes', 'nullable', 'date'],
            'sanction_statut_id' => ['sometimes', 'required', 'exists:sanction_statuts,id'],
            'commentaires_rh' => ['sometimes', 'nullable', 'string'],
        ]);

        $sanction->update($validated);

        // Handle file deletions
        if ($request->has('files_to_delete')) {
            $fileIds = is_array($request->files_to_delete) 
                ? $request->files_to_delete 
                : json_decode($request->files_to_delete, true);
            
            if ($fileIds) {
                foreach ($fileIds as $fileId) {
                    $doc = SanctionDocument::find($fileId);
                    if ($doc && $doc->sanction_id === $sanction->id) {
                        Storage::disk('public')->delete($doc->chemin);
                        $doc->delete();
                    }
                }
            }
        }

        // Handle new file uploads
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->store('sanctions', 'public');
                SanctionDocument::create([
                    'sanction_id' => $sanction->id,
                    'nom' => $file->getClientOriginalName(),
                    'chemin' => $path,
                    'type' => $request->input('document_type', 'autre'),
                ]);
            }
        }

        return response()->json($sanction->load(['type', 'gravite', 'statut', 'departement', 'conflit', 'documents']));
    }

    public function destroy(Sanction $sanction)
    {
        // Delete associated documents
        foreach ($sanction->documents as $doc) {
            Storage::disk('public')->delete($doc->chemin);
            $doc->delete();
        }

        $sanction->delete();

        return response()->noContent();
    }

    // Get sanctions history for a specific employee
    public function employeeHistory($matricule)
    {
        $sanctions = Sanction::with(['type', 'gravite', 'statut'])
            ->where('matricule', $matricule)
            ->orderByDesc('date_sanction')
            ->get();

        // Count active sanctions by type
        $activeSanctions = Sanction::where('matricule', $matricule)
            ->whereHas('statut', function ($q) {
                $q->whereNotIn('nom', ['Clôturée']);
            })
            ->selectRaw('sanction_type_id, COUNT(*) as count')
            ->groupBy('sanction_type_id')
            ->with('type')
            ->get()
            ->map(function ($item) {
                return [
                    'type' => $item->type ? $item->type->nom : 'Non défini',
                    'count' => $item->count
                ];
            });

        return response()->json([
            'sanctions' => $sanctions,
            'active_summary' => $activeSanctions,
            'total_active' => $activeSanctions->sum('count'),
        ]);
    }

    // Dashboard stats
    public function dashboardStats()
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $totalSanctions = Sanction::count();
        
        $sanctionsThisMonth = Sanction::whereMonth('date_sanction', $currentMonth)
            ->whereYear('date_sanction', $currentYear)
            ->count();

        $byType = Sanction::selectRaw('sanction_type_id, COUNT(*) as count')
            ->whereNotNull('sanction_type_id')
            ->groupBy('sanction_type_id')
            ->get()
            ->map(function ($item) {
                $type = \App\Models\SanctionType::find($item->sanction_type_id);
                return [
                    'type' => $type ? $type->nom : 'Non défini',
                    'count' => $item->count
                ];
            });

        $byGravite = Sanction::selectRaw('sanction_gravite_id, COUNT(*) as count')
            ->whereNotNull('sanction_gravite_id')
            ->groupBy('sanction_gravite_id')
            ->get()
            ->map(function ($item) {
                $gravite = \App\Models\SanctionGravite::find($item->sanction_gravite_id);
                return [
                    'gravite' => $gravite ? $gravite->nom : 'Non défini',
                    'count' => $item->count
                ];
            });

        $byStatut = Sanction::selectRaw('sanction_statut_id, COUNT(*) as count')
            ->whereNotNull('sanction_statut_id')
            ->groupBy('sanction_statut_id')
            ->get()
            ->map(function ($item) {
                $statut = \App\Models\SanctionStatut::find($item->sanction_statut_id);
                return [
                    'statut' => $statut ? $statut->nom : 'Non défini',
                    'count' => $item->count
                ];
            });

        $byDepartment = Sanction::selectRaw('departement_id, COUNT(*) as count')
            ->whereNotNull('departement_id')
            ->groupBy('departement_id')
            ->get()
            ->map(function ($item) {
                $dept = \App\Models\Departement::find($item->departement_id);
                return [
                    'departement' => $dept ? $dept->nom : 'Non assigné',
                    'count' => $item->count
                ];
            });

        return response()->json([
            'total' => $totalSanctions,
            'this_month' => $sanctionsThisMonth,
            'by_type' => $byType,
            'by_gravite' => $byGravite,
            'by_statut' => $byStatut,
            'by_department' => $byDepartment,
        ]);
    }
}
