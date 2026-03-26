<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeCompetencesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'competence_ids' => 'required|array',
            'competence_ids.*' => 'integer|exists:gp_competences,id',
            'pivots' => 'nullable|array',
            'pivots.*.niveau' => 'nullable|integer|min:0|max:5',
            'pivots.*.niveau_acquis' => 'nullable|integer|min:0|max:5',
            'pivots.*.date_acquisition' => 'nullable|date',
        ];
    }
}
