<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeFormation extends Model
{
    use HasFactory;

    public const STATUTS = [
        'En étude',
        'Validée',
        'Refusée',
        'Planifiée',
        'Réalisée',
    ];

    public const URGENCES = [
        'Faible',
        'Moyenne',
        'Haute',
    ];

    public const SOURCES_DEMANDE = [
        'Manager',
        'Employé',
        'Plan annuel',
        'Obligation légale',
    ];

    protected $table = 'demandes_formation';

    protected $fillable = [
        'employe_id',
        'manager_id',
        'departement_id',
        'formation_souhaitee',
        'objectif',
        'lien_poste',
        'urgence',
        'cout_estime',
        'source_demande',
        'commentaire_rh',
        'organisation_formation',
        'inscription',
        'suivi_participation',
        'resultat',
        'certificat_path',
        'statut',
        'created_by',
    ];

    protected $casts = [
        'cout_estime' => 'decimal:2',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class, 'employe_id');
    }

    public function manager()
    {
        return $this->belongsTo(Employe::class, 'manager_id');
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class, 'departement_id');
    }
}
