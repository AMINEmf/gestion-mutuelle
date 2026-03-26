<?php

namespace App\Http\Controllers;

use App\Models\TypeOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TypeOperationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $types = TypeOperation::all();
        return response()->json($types);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:255|unique:type_operations',
            'necessite_montant' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $type = TypeOperation::create([
            'label' => $request->label,
            'necessite_montant' => $request->necessite_montant ?? false,
        ]);

        return response()->json($type, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $type = TypeOperation::find($id);

        if (!$type) {
            return response()->json(['message' => 'Type operation not found'], 404);
        }

        return response()->json($type);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $type = TypeOperation::find($id);

        if (!$type) {
            return response()->json(['message' => 'Type operation not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:255|unique:type_operations,label,' . $id,
            'necessite_montant' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $type->update([
            'label' => $request->label,
            'necessite_montant' => $request->necessite_montant ?? $type->necessite_montant,
        ]);

        return response()->json($type);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $type = TypeOperation::find($id);

        if (!$type) {
            return response()->json(['message' => 'Type operation not found'], 404);
        }
        
        $type->delete();

        return response()->json(['message' => 'Type operation deleted successfully']);
    }
}
