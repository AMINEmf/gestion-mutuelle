<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sanction extends Model
{
    use HasFactory;

    protected $fillable = [
        'employe',
        'matricule',
        'date_sanction',
        'reference_dossier',
        'departement_id',
        'sanction_type_id',
        'motif_description',
        'rappel_faits',
        'conflit_id',
        'sanction_gravite_id',
        'duree_jours',
        'impact_salaire',
        'montant_impact',
        'date_effet',
        'date_fin',
        'sanction_statut_id',
        'commentaires_rh',
    ];

    protected $casts = [
        'date_sanction' => 'date',
        'date_effet' => 'date',
        'date_fin' => 'date',
        'impact_salaire' => 'boolean',
        'montant_impact' => 'decimal:2',
    ];

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function type()
    {
        return $this->belongsTo(SanctionType::class, 'sanction_type_id');
    }

    public function gravite()
    {
        return $this->belongsTo(SanctionGravite::class, 'sanction_gravite_id');
    }

    public function statut()
    {
        return $this->belongsTo(SanctionStatut::class, 'sanction_statut_id');
    }

    public function conflit()
    {
        return $this->belongsTo(Conflit::class);
    }

    public function documents()
    {
        return $this->hasMany(SanctionDocument::class);
    }
}
