<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CnssDocumentResource;

class CnssOperationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employe_id' => $this->employe_id,
            'type_operation' => $this->type_operation,
            'date_operation' => optional($this->date_operation)->toDateString(),
            'beneficiary_type' => $this->beneficiary_type,
            'beneficiary_name' => $this->beneficiary_name,
            'beneficiary_relation' => $this->beneficiary_relation,
            'relation' => $this->beneficiary_relation,
            'reference' => $this->reference,
            'montant' => $this->montant,
            'montant_total' => $this->montant_total,
            'taux_remboursement' => $this->taux_remboursement,
            'montant_rembourse' => $this->montant_rembourse,
            'montant_reste_a_charge' => $this->montant_reste_a_charge,
            'statut' => $this->statut,
            'notes' => $this->notes,
            'documents_count' => (int) ($this->documents_count ?? 0),
            'documents' => CnssDocumentResource::collection($this->whenLoaded('documents')),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => optional($this->created_at)->toDateTimeString(),
            'updated_at' => optional($this->updated_at)->toDateTimeString(),
        ];
    }
}
