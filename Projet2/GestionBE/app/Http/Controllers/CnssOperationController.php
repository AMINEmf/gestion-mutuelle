<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCnssOperationRequest;
use App\Http\Requests\UpdateCnssOperationRequest;
use App\Http\Resources\CnssOperationResource;
use App\Models\CnssDocument;
use App\Models\CnssOperation;
use App\Models\Employe;
use Illuminate\Support\Facades\Storage;

class CnssOperationController extends Controller
{
    private const TYPES_AVEC_MONTANTS = ['PAIEMENT', 'REGULARISATION', 'REMBOURSEMENT', 'MUTUELLE'];

    private function normalizeStatus($value): string
    {
        return strtoupper(preg_replace('/\s+/', '_', trim((string) $value)));
    }

    public function index($employeId)
    {
        $employe = Employe::findOrFail($employeId);

        $operations = CnssOperation::where('employe_id', $employe->id)
            ->withCount('documents')
            ->orderBy('date_operation', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return CnssOperationResource::collection($operations);
    }

    public function store(StoreCnssOperationRequest $request, $employeId)
    {
        $employe = Employe::findOrFail($employeId);
        $userId = $request->user()?->id;
        $typeOperation = $request->input('type_operation');
        $requiresMutuelleAmounts = in_array($typeOperation, self::TYPES_AVEC_MONTANTS, true);

        $beneficiaryType = $request->input('beneficiary_type', 'EMPLOYE');
        $beneficiaryName = $beneficiaryType === 'EMPLOYE' ? null : $request->input('beneficiary_name');
        $beneficiaryRelation = $beneficiaryType === 'EMPLOYE' ? null : $request->input('beneficiary_relation');

        $montantTotal = $requiresMutuelleAmounts ? (float) $request->input('montant_total') : null;
        $montantRembourse = $requiresMutuelleAmounts ? (float) $request->input('montant_rembourse') : null;
        $montantResteACharge = $requiresMutuelleAmounts
            ? max(0, round($montantTotal - $montantRembourse, 2))
            : null;

        $operation = CnssOperation::create([
            'employe_id' => $employe->id,
            'type_operation' => $typeOperation,
            'date_operation' => $request->input('date_operation'),
            'beneficiary_type' => $beneficiaryType,
            'beneficiary_name' => $beneficiaryName,
            'beneficiary_relation' => $beneficiaryRelation,
            'reference' => $request->input('reference'),
            'montant' => $requiresMutuelleAmounts ? $montantTotal : $request->input('montant'),
            'montant_total' => $montantTotal,
            'taux_remboursement' => null,
            'montant_rembourse' => $montantRembourse,
            'montant_reste_a_charge' => $montantResteACharge,
            'statut' => $this->normalizeStatus($request->input('statut')),
            'notes' => $request->input('notes'),
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);

        $operation->loadCount('documents');

        return new CnssOperationResource($operation);
    }

    public function show($operationId)
    {
        $operation = CnssOperation::with(['documents' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->withCount('documents')->findOrFail($operationId);
        return new CnssOperationResource($operation);
    }

    public function update(UpdateCnssOperationRequest $request, $operationId)
    {
        $operation = CnssOperation::findOrFail($operationId);

        $typeOperation = $request->input('type_operation');
        $requiresMutuelleAmounts = in_array($typeOperation, self::TYPES_AVEC_MONTANTS, true);

        $beneficiaryType = $request->input('beneficiary_type', 'EMPLOYE');
        $beneficiaryName = $beneficiaryType === 'EMPLOYE' ? null : $request->input('beneficiary_name');
        $beneficiaryRelation = $beneficiaryType === 'EMPLOYE' ? null : $request->input('beneficiary_relation');

        $montantTotal = $requiresMutuelleAmounts ? (float) $request->input('montant_total') : null;
        $montantRembourse = $requiresMutuelleAmounts ? (float) $request->input('montant_rembourse') : null;
        $montantResteACharge = $requiresMutuelleAmounts
            ? max(0, round($montantTotal - $montantRembourse, 2))
            : null;

        $operation->update([
            'type_operation' => $typeOperation,
            'date_operation' => $request->input('date_operation'),
            'beneficiary_type' => $beneficiaryType,
            'beneficiary_name' => $beneficiaryName,
            'beneficiary_relation' => $beneficiaryRelation,
            'reference' => $request->input('reference'),
            'montant' => $requiresMutuelleAmounts ? $montantTotal : $request->input('montant'),
            'montant_total' => $montantTotal,
            'taux_remboursement' => null,
            'montant_rembourse' => $montantRembourse,
            'montant_reste_a_charge' => $montantResteACharge,
            'statut' => $this->normalizeStatus($request->input('statut')),
            'notes' => $request->input('notes'),
            'updated_by' => $request->user()?->id,
        ]);

        $operation->loadCount('documents');

        return new CnssOperationResource($operation);
    }

    public function destroy($operationId)
    {
        $operation = CnssOperation::findOrFail($operationId);

        // Supprimer les fichiers physiques et enregistrements documents avant de supprimer l'opération
        foreach ($operation->documents as $document) {
            if (Storage::exists($document->stored_name)) {
                Storage::delete($document->stored_name);
            }
            $document->delete();
        }

        $operation->delete();

        return response()->json([
            'message' => 'Operation CNSS supprimée avec succès',
        ], 200);
    }
}
