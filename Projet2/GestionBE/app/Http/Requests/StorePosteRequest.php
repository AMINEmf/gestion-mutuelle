<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePosteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'unite_id' => 'nullable|exists:gp_unites,id',
            'departement_id' => 'nullable|exists:departements,id',
            'grade_id' => 'nullable|exists:gp_grades,id',
            'statut' => 'nullable|in:actif,vacant',
            'niveau' => 'nullable|string|max:50',
            'domaine' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'code' => 'nullable|string|max:50',
        ];
    }
}
