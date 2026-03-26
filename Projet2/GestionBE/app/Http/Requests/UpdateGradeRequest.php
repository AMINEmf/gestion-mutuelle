<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $gradeId = $this->route('grade');
        if (is_object($gradeId) && property_exists($gradeId, 'id')) {
            $gradeId = $gradeId->id;
        }

        return [
            'code' => 'sometimes|required|string|max:20|unique:gp_grades,code,' . $gradeId,
            'label' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ];
    }
}
