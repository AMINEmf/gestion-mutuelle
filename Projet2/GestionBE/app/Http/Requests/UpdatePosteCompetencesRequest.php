<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePosteCompetencesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'competence_ids' => 'nullable|array',
            'competence_ids.*' => 'integer|exists:gp_competences,id',
            'pivots' => 'nullable|array',
            'pivots.*.niveau_requis' => 'nullable|integer|min:0|max:5',
            'pivots.*.is_required' => 'nullable|boolean',
            'competences' => 'nullable|array',
            'competences.*.competence_id' => 'required|integer|exists:gp_competences,id',
            'competences.*.niveau_requis' => 'nullable|integer|min:0|max:5',
            'competences.*.is_required' => 'nullable|boolean',
        ];
    }
}
