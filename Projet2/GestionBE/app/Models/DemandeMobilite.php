<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeMobilite extends Model
{
    use HasFactory;

    public const STATUTS = [
        'En étude',
        'Avis manager demandé',
        'En validation direction',
        'Acceptée',
        'Refusée',
        'Planifiée',
    ];

    public const TYPES_MOBILITE = [
        'Promotion',
        'Mutation interne',
        'Changement de département',
        'Reclassification',
    ];

    public const SOURCES_DEMANDE = [
        'Entretien avec l’employé',
        'Demande par mail',
        'Recommandation manager',
        'Plan de carrière',
    ];

    public const DISPONIBILITE_POSTE_VALUES = [
        'Oui',
        'Non',
        'En attente',
    ];

    protected $table = 'demandes_mobilite';

    protected $fillable = [
        'employe_id',
        'poste_actuel',
        'departement_actuel',
        'poste_souhaite',
        'type_mobilite',
        'source_demande',
        'motivation',
        'disponibilite',
        'avis_manager',
        'cv_interne_path',
        'cv_interne_nom_original',
        'compatibilite_profil_poste',
        'besoin_formation',
        'details_formation',
        'disponibilite_poste',
        'impact_organisationnel',
        'commentaire_rh',
        'statut',
        'created_by',
        'rh_responsable',
    ];

    protected $casts = [
        'disponibilite' => 'date',
        'besoin_formation' => 'boolean',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class, 'employe_id');
    }
}
