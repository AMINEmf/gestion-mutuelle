<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutuelleOperation extends Model
{
    use HasFactory;

    protected $fillable = [
        'affiliation_id',
        'numero_dossier',
        'beneficiaire_type',
        'beneficiaire_nom',
        'date_operation',
        'date_depot',
        'date_remboursement',
        'type_operation',
        'statut',
        'montant_total',
        'montant_rembourse',
        'reste_a_charge',
        'commentaire',
    ];

    protected $casts = [
        'date_operation' => 'date',
        'date_depot' => 'date',
        'date_remboursement' => 'date',
        'montant_total' => 'decimal:2',
        'montant_rembourse' => 'decimal:2',
        'reste_a_charge' => 'decimal:2',
    ];

    /**
     * Relation principale vers l'affiliation
     */
    public function affiliation()
    {
        return $this->belongsTo(AffiliationMutuelle::class, 'affiliation_id');
    }

    /**
     * Accès à l'employé via l'affiliation (pour la compatibilité)
     */
    public function employe()
    {
        return $this->hasOneThrough(
            Employe::class,
            AffiliationMutuelle::class,
            'id',        // clé étrangère sur affiliations_mutuelle
            'id',        // clé étrangère sur employes
            'affiliation_id', // clé locale sur mutuelle_operations
            'employe_id' // clé locale sur affiliations_mutuelle
        );
    }

    /**
     * Documents liés à cette opération
     */
    public function documents()
    {
        return $this->hasMany(MutuelleDocument::class, 'operation_id');
    }
}
