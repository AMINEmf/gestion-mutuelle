<?php

namespace App\Http\Controllers;

use App\Models\Conflit;
use App\Models\ConflitPieceJointe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ConflitController extends Controller
{
    public function index()
    {
        return Conflit::with(['piecesJointes', 'lieu', 'type', 'statutDossier'])
            ->orderByDesc('date_incident')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Section 1
            'employe' => ['required', 'string', 'max:255'],
            'matricule' => ['required', 'string', 'max:255'],
            'departement' => ['nullable', 'string', 'max:255'],
            'poste' => ['nullable', 'string', 'max:255'],
            'date_incident' => ['required', 'date'],
            'conflit_lieu_id' => ['required', 'exists:conflit_lieux,id'],
            
            // Section 2
            'conflit_type_id' => ['required', 'exists:conflit_types,id'],
            
            // Section 3
            'partie_nom' => ['nullable', 'string', 'max:255'],
            'partie_type' => ['nullable', Rule::in(['interne', 'externe'])],
            'partie_fonction' => ['nullable', 'string', 'max:255'],
            'partie_organisation' => ['nullable', 'string', 'max:255'],
            
            // Section 4
            'description' => ['nullable', 'string'],
            'temoins' => ['nullable', 'string'],
            'circonstances' => ['nullable', 'string'],
            
            // Section 5
            'gravite' => ['required', Rule::in(['faible', 'moyen', 'eleve', 'critique'])],
            'confidentialite' => ['required', Rule::in(['normal', 'sensible'])],
            
            // Section 7
            'conflit_statut_id' => ['required', 'exists:conflit_statuts,id'],
            'responsable_rh' => ['nullable', 'string', 'max:255'],
            'commentaires_rh' => ['nullable', 'string'],
            
            // Section 6 - Fichiers
            'pieces_jointes' => ['nullable', 'array'],
            'pieces_jointes.*' => ['file', 'max:10240'], // 10MB max par fichier
            'types_fichiers' => ['nullable', 'array'],
            'types_fichiers.*' => ['nullable', 'string'],
        ]);

        // Remove file fields from validated data
        unset($validated['pieces_jointes']);
        unset($validated['types_fichiers']);

        $conflit = Conflit::create($validated);

        // Handle file uploads
        if ($request->hasFile('pieces_jointes')) {
            $this->handleFileUploads($conflit, $request->file('pieces_jointes'), $request->input('types_fichiers', []));
        }

        return response()->json($conflit->load(['piecesJointes', 'lieu', 'type', 'statutDossier']), 201);
    }

    public function show(Conflit $conflit)
    {
        return $conflit->load('piecesJointes');
    }

    public function update(Request $request, Conflit $conflit)
    {
        $validated = $request->validate([
            // Section 1
            'employe' => ['sometimes', 'required', 'string', 'max:255'],
            'matricule' => ['sometimes', 'required', 'string', 'max:255'],
            'departement' => ['sometimes', 'nullable', 'string', 'max:255'],
            'poste' => ['sometimes', 'nullable', 'string', 'max:255'],
            'date_incident' => ['sometimes', 'required', 'date'],
            'conflit_lieu_id' => ['sometimes', 'required', 'exists:conflit_lieux,id'],
            
            // Section 2
            'conflit_type_id' => ['sometimes', 'required', 'exists:conflit_types,id'],
            
            // Section 3
            'partie_nom' => ['sometimes', 'nullable', 'string', 'max:255'],
            'partie_type' => ['sometimes', 'nullable', Rule::in(['interne', 'externe'])],
            'partie_fonction' => ['sometimes', 'nullable', 'string', 'max:255'],
            'partie_organisation' => ['sometimes', 'nullable', 'string', 'max:255'],
            
            // Section 4
            'description' => ['sometimes', 'nullable', 'string'],
            'temoins' => ['sometimes', 'nullable', 'string'],
            'circonstances' => ['sometimes', 'nullable', 'string'],
            
            // Section 5
            'gravite' => ['sometimes', 'required', Rule::in(['faible', 'moyen', 'eleve', 'critique'])],
            'confidentialite' => ['sometimes', 'required', Rule::in(['normal', 'sensible'])],
            
            // Section 7
            'conflit_statut_id' => ['sometimes', 'required', 'exists:conflit_statuts,id'],
            'responsable_rh' => ['sometimes', 'nullable', 'string', 'max:255'],
            'commentaires_rh' => ['sometimes', 'nullable', 'string'],
            
            // Fichiers à supprimer
            'fichiers_a_supprimer' => ['nullable', 'array'],
            'fichiers_a_supprimer.*' => ['integer'],
            
            // Nouveaux fichiers
            'pieces_jointes' => ['nullable', 'array'],
            'pieces_jointes.*' => ['file', 'max:10240'],
            'types_fichiers' => ['nullable', 'array'],
            'types_fichiers.*' => ['nullable', 'string'],
        ]);

        // Remove file fields
        unset($validated['pieces_jointes']);
        unset($validated['types_fichiers']);
        $fichiersASupprimer = $validated['fichiers_a_supprimer'] ?? [];
        unset($validated['fichiers_a_supprimer']);

        $conflit->update($validated);

        // Delete specified files
        if (!empty($fichiersASupprimer)) {
            $this->deleteFiles($conflit, $fichiersASupprimer);
        }

        // Handle new file uploads
        if ($request->hasFile('pieces_jointes')) {
            $this->handleFileUploads($conflit, $request->file('pieces_jointes'), $request->input('types_fichiers', []));
        }

        return response()->json($conflit->load(['piecesJointes', 'lieu', 'type', 'statutDossier']));
    }

    public function destroy(Conflit $conflit)
    {
        // Delete all associated files from storage
        foreach ($conflit->piecesJointes as $piece) {
            Storage::disk('public')->delete($piece->chemin_fichier);
        }

        $conflit->delete();

        return response()->noContent();
    }

    /**
     * Upload a single file to an existing conflit
     */
    public function uploadFile(Request $request, Conflit $conflit)
    {
        $request->validate([
            'fichier' => ['required', 'file', 'max:10240'],
            'type_fichier' => ['nullable', 'string'],
        ]);

        $file = $request->file('fichier');
        $path = $file->store('conflits/' . $conflit->id, 'public');

        $pieceJointe = ConflitPieceJointe::create([
            'conflit_id' => $conflit->id,
            'nom_fichier' => $file->getClientOriginalName(),
            'chemin_fichier' => $path,
            'type_fichier' => $request->input('type_fichier', 'autre'),
            'mime_type' => $file->getMimeType(),
            'taille' => $file->getSize(),
        ]);

        return response()->json($pieceJointe, 201);
    }

    /**
     * Delete a specific file
     */
    public function deleteFile(Conflit $conflit, ConflitPieceJointe $pieceJointe)
    {
        if ($pieceJointe->conflit_id !== $conflit->id) {
            return response()->json(['error' => 'Ce fichier n\'appartient pas à ce conflit.'], 403);
        }

        Storage::disk('public')->delete($pieceJointe->chemin_fichier);
        $pieceJointe->delete();

        return response()->noContent();
    }

    /**
     * Get dashboard statistics
     */
    public function dashboardStats()
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;

        // Total conflits
        $totalConflits = Conflit::count();

        // Conflits this month
        $conflitsThisMonth = Conflit::whereMonth('date_incident', $currentMonth)
            ->whereYear('date_incident', $currentYear)
            ->count();

        // By status
        $byStatut = Conflit::selectRaw('statut, COUNT(*) as count')
            ->groupBy('statut')
            ->get()
            ->mapWithKeys(fn($item) => [
                Conflit::getStatutLabels()[$item->statut] ?? $item->statut => $item->count
            ]);

        // By nature
        $byNature = Conflit::selectRaw('nature_conflit, COUNT(*) as count')
            ->groupBy('nature_conflit')
            ->get()
            ->mapWithKeys(fn($item) => [
                Conflit::getNatureLabels()[$item->nature_conflit] ?? $item->nature_conflit => $item->count
            ]);

        // By gravité
        $byGravite = Conflit::selectRaw('gravite, COUNT(*) as count')
            ->groupBy('gravite')
            ->get()
            ->mapWithKeys(fn($item) => [
                Conflit::getGraviteLabels()[$item->gravite] ?? $item->gravite => $item->count
            ]);

        // Monthly evolution (last 12 months)
        $monthlyEvolution = Conflit::selectRaw('MONTH(date_incident) as mois, YEAR(date_incident) as annee, COUNT(*) as count')
            ->where('date_incident', '>=', now()->subMonths(12))
            ->groupBy('mois', 'annee')
            ->orderBy('annee')
            ->orderBy('mois')
            ->get();

        // Recent conflits
        $recentConflits = Conflit::with('piecesJointes')
            ->orderByDesc('date_incident')
            ->limit(5)
            ->get();

        return response()->json([
            'totalConflits' => $totalConflits,
            'conflitsThisMonth' => $conflitsThisMonth,
            'byStatut' => $byStatut,
            'byNature' => $byNature,
            'byGravite' => $byGravite,
            'monthlyEvolution' => $monthlyEvolution,
            'recentConflits' => $recentConflits,
        ]);
    }

    /**
     * Get labels for dropdowns
     */
    public function getLabels()
    {
        return response()->json([
            'natures' => Conflit::getNatureLabels(),
            'statuts' => Conflit::getStatutLabels(),
            'gravites' => Conflit::getGraviteLabels(),
            'confidentialites' => [
                'normal' => 'Normal',
                'sensible' => 'Sensible',
            ],
            'typesPartie' => [
                'interne' => 'Interne (employé, stagiaire…)',
                'externe' => 'Externe (client, fournisseur, visiteur…)',
            ],
        ]);
    }

    // Private helper methods

    private function handleFileUploads(Conflit $conflit, array $files, array $types = [])
    {
        foreach ($files as $index => $file) {
            $path = $file->store('conflits/' . $conflit->id, 'public');

            ConflitPieceJointe::create([
                'conflit_id' => $conflit->id,
                'nom_fichier' => $file->getClientOriginalName(),
                'chemin_fichier' => $path,
                'type_fichier' => $types[$index] ?? 'autre',
                'mime_type' => $file->getMimeType(),
                'taille' => $file->getSize(),
            ]);
        }
    }

    private function deleteFiles(Conflit $conflit, array $ids)
    {
        $pieces = ConflitPieceJointe::whereIn('id', $ids)
            ->where('conflit_id', $conflit->id)
            ->get();

        foreach ($pieces as $piece) {
            Storage::disk('public')->delete($piece->chemin_fichier);
            $piece->delete();
        }
    }
}
