<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Models\GpGrade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $query = GpGrade::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('label', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $grade = GpGrade::findOrFail($id);

        return response()->json($grade);
    }

    public function store(StoreGradeRequest $request)
    {
        $grade = GpGrade::create($request->validated());

        return response()->json($grade, 201);
    }

    public function update(UpdateGradeRequest $request, $id)
    {
        $grade = GpGrade::findOrFail($id);
        $grade->update($request->validated());

        return response()->json($grade);
    }

    public function destroy($id)
    {
        $grade = GpGrade::findOrFail($id);
        $grade->delete();

        return response()->json(null, 204);
    }
}
