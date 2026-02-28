<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\MutuelleDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class MutuelleDocumentController extends Controller
{
    public function index(Employe $employe)
    {
        $documents = $employe->mutuelleDocuments()->orderByDesc('created_at')->get();

        return response()->json($documents);
    }

    /**
     * Upload a new document linked to an operation
     * POST /api/mutuelles/documents
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'operation_id' => 'required|exists:mutuelle_operations,id',
            'fichier' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'nom' => 'nullable|string|max:255',
            'type_document' => 'nullable|string|max:100',
        ]);

        $filePath = null;
        $fileName = null;

        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('mutuelles/documents', 'public');
        }

        // Get the operation to derive employe_id if needed
        $operation = \App\Models\MutuelleOperation::with('affiliation')->findOrFail($validated['operation_id']);

        $document = MutuelleDocument::create([
            'operation_id' => $validated['operation_id'],
            'employe_id' => $operation->affiliation->employe_id,
            'type_document' => $validated['type_document'] ?? null,
            'nom' => $validated['nom'] ?? $fileName,
            'file_path' => $filePath,
            'file_name' => $fileName,
        ]);

        // Add public URL for easy access
        $document->url = $filePath ? \Storage::url($filePath) : null;

        return response()->json($document, 201);
    }

    /**
     * Legacy store method (by employee)
     * POST /api/mutuelles/dossiers/{employe}/documents
     */
    public function storeByEmploye(Request $request, Employe $employe)
    {
        $validated = $request->validate([
            'nom' => 'nullable|string|max:255',
            'fichier' => 'nullable|file|max:2048',
        ]);

        $filePath = null;
        $fileName = null;

        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('mutuelle/documents', 'public');
        }

        $document = MutuelleDocument::create([
            'employe_id' => $employe->id,
            'nom' => $validated['nom'] ?? $fileName,
            'file_path' => $filePath,
            'file_name' => $fileName,
        ]);

        return response()->json($document, 201);
    }

    public function storeFromOperation(Request $request)
    {
        $validated = $request->validate([
            'operation_id' => 'required|exists:mutuelle_operations,id',
            'nom' => 'nullable|string|max:255',
            'fichier' => 'required|file|max:2048',
        ]);

        $operation = \App\Models\MutuelleOperation::with('affiliation')->find($validated['operation_id']);
        $employeId = $operation->affiliation->employe_id;

        $filePath = null;
        $fileName = null;

        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('mutuelle/documents', 'public');
        }

        $document = MutuelleDocument::create([
            'employe_id' => $employeId,
            'operation_id' => $operation->id,
            'nom' => $validated['nom'] ?? $fileName,
            'file_path' => $filePath,
            'file_name' => $fileName,
        ]);

        return response()->json($document, 201);
    }

    public function destroy(MutuelleDocument $document)
    {
        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json(['message' => 'Document supprimé'], 200);
    }

    /**
     * Download a document
     * GET /api/mutuelles/documents/{document}/download
     */
    public function download(MutuelleDocument $document)
    {
        if (!$document->file_path || !Storage::disk('public')->exists($document->file_path)) {
            return response()->json(['message' => 'Fichier introuvable'], 404);
        }

        $filePath = Storage::disk('public')->path($document->file_path);
        $fileName = $document->file_name ?? basename($document->file_path);

        return response()->download($filePath, $fileName);
    }
}
