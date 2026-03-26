<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conflit extends Model
{
    use HasFactory;

    protected $fillable = [
        // Section 1: Informations générales
        'employe',
        'matricule',
        'departement',
        'poste',
        'date_incident',
        'lieu_incident',
        'conflit_lieu_id',
        
        // Section 2: Nature du conflit
        'nature_conflit',
        'conflit_type_id',
        
        // Section 3: Partie impliquée
        'partie_nom',
        'partie_type',
        'partie_fonction',
        'partie_organisation',
        
        // Section 4: Description
        'description',
        'temoins',
        'circonstances',
        
        // Section 5: Évaluation RH
        'gravite',
        'confidentialite',
        
        // Section 7: Suivi
        'statut',
        'conflit_statut_id',
        'responsable_rh',
        'commentaires_rh',
    ];

    protected $casts = [
        'date_incident' => 'date',
    ];

    // Relations vers les ressources
    public function lieu()
    {
        return $this->belongsTo(ConflitLieu::class, 'conflit_lieu_id');
    }

    public function type()
    {
        return $this->belongsTo(ConflitType::class, 'conflit_type_id');
    }

    public function statutDossier()
    {
        return $this->belongsTo(ConflitStatut::class, 'conflit_statut_id');
    }

    public function piecesJointes()
    {
        return $this->hasMany(ConflitPieceJointe::class);
    }

    // Labels pour l'affichage
    public static function getNatureLabels()
    {
        return [
            'conflit_interne' => 'Conflit interne',
            'conflit_externe' => 'Conflit avec partie externe',
            'incident_comportemental' => 'Incident comportemental',
            'litige_professionnel' => 'Litige professionnel',
            'harcelement' => 'Harcèlement',
            'non_respect_procedures' => 'Non-respect des procédures',
            'altercation' => 'Altercation verbale ou physique',
            'autre' => 'Autre',
        ];
    }

    public static function getStatutLabels()
    {
        return [
            'nouveau' => 'Nouveau',
            'en_etude' => 'En étude',
            'en_enquete' => 'En enquête',
            'en_attente' => 'En attente d\'informations',
            'en_decision' => 'En décision',
            'cloture' => 'Clôturé',
        ];
    }

    public static function getGraviteLabels()
    {
        return [
            'faible' => 'Faible',
            'moyen' => 'Moyen',
            'eleve' => 'Élevé',
            'critique' => 'Critique',
        ];
    }
}
