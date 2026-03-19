<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCnssOperationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type_operation' => 'required|string|max:255',
            'date_operation' => 'required|date',
            'statut' => 'required|in:EN_COURS,TERMINEE,ANNULEE',
            'beneficiary_type' => 'required|in:EMPLOYE,CONJOINT,ENFANT',
            'beneficiary_name' => 'nullable|string|max:255|required_unless:beneficiary_type,EMPLOYE',
            'beneficiary_relation' => 'nullable|string|max:255|required_unless:beneficiary_type,EMPLOYE',
            'reference' => 'nullable|string|max:255',
            'montant' => 'nullable|numeric|min:0',
            'montant_total' => 'nullable|numeric|gt:0|required_if:type_operation,PAIEMENT,REGULARISATION,REMBOURSEMENT,MUTUELLE',
            'taux_remboursement' => 'nullable|numeric|min:0|max:100',
            'montant_rembourse' => 'nullable|numeric|min:0|lte:montant_total|required_if:type_operation,PAIEMENT,REGULARISATION,REMBOURSEMENT,MUTUELLE',
            'montant_reste_a_charge' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ];
    }
}
