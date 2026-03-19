<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePosteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'sometimes|required|string|max:255',
            'unite_id' => 'sometimes|nullable|exists:gp_unites,id',
            'departement_id' => 'sometimes|nullable|exists:departements,id',
            'grade_id' => 'nullable|exists:gp_grades,id',
            'statut' => 'nullable|in:Actif,Vacant,actif,vacant,Confirmé,confirmé,En attente,en attente',
            'niveau' => 'nullable|string|max:50',
            'domaine' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'code' => 'nullable|string|max:50',
        ];
    }
}
