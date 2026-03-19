<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CnssOperation extends Model
{
    use HasFactory;

    protected $table = 'cnss_operations';

    protected $fillable = [
        'employe_id',
        'type_operation',
        'date_operation',
        'beneficiary_type',
        'beneficiary_name',
        'beneficiary_relation',
        'reference',
        'montant',
        'montant_total',
        'taux_remboursement',
        'montant_rembourse',
        'montant_reste_a_charge',
        'statut',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_operation' => 'date',
        'montant' => 'decimal:2',
        'montant_total' => 'decimal:2',
        'taux_remboursement' => 'decimal:2',
        'montant_rembourse' => 'decimal:2',
        'montant_reste_a_charge' => 'decimal:2',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class, 'employe_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function documents()
    {
        return $this->hasMany(CnssDocument::class, 'operation_id');
    }
}
