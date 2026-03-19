<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarriereRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employe_id' => ['required', 'exists:employes,id'],
            'poste_id' => ['required', 'exists:gp_postes,id'],
            'grade_id' => ['nullable', 'exists:gp_grades,id'],
            'manager_id' => ['nullable', 'exists:employes,id', 'different:employe_id'],
            // type_evolution est maintenant calculé automatiquement - ne doit plus être envoyé
        ];
    }

    public function messages(): array
    {
        return [
            'manager_id.exists' => 'Le manager sélectionné est introuvable.',
            'manager_id.different' => 'Un employé ne peut pas être son propre manager.',
        ];
    }
}

