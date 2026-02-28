<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AffiliationMutuelle extends Model
{
    use HasFactory;

    protected $table = 'affiliations_mutuelle';

    protected $fillable = [
        'employe_id',
        'mutuelle_id',
        'regime_mutuelle_id',
        'numero_adherent',
        'date_adhesion',
        'date_resiliation',
        'ayant_droit',
        'conjoint_ayant_droit',
        'statut',
        'commentaire'
    ];

    protected $casts = [
        'ayant_droit' => 'boolean',
        'conjoint_ayant_droit' => 'boolean',
        'date_adhesion' => 'date',
        'date_resiliation' => 'date'
    ];

    /**
     * Une affiliation appartient à un employé
     */
    public function employe()
    {
        return $this->belongsTo(Employe::class, 'employe_id');
    }

    /**
     * Une affiliation appartient à une mutuelle
     */
    public function mutuelle()
    {
        return $this->belongsTo(Mutuelle::class, 'mutuelle_id');
    }

    /**
     * Une affiliation appartient à un régime
     */
    public function regime()
    {
        return $this->belongsTo(RegimeMutuelle::class, 'regime_mutuelle_id');
    }

    /**
     * Scope : Seulement les affiliations actives
     */
    public function scopeActive($query)
    {
        return $query->where('statut', 'ACTIVE');
    }

    /**
     * Scope : Seulement les affiliations résiliées
     */
    public function scopeResiliees($query)
    {
        return $query->where('statut', 'RESILIE');
    }

    /**
     * Une affiliation peut avoir plusieurs opérations
     */
    public function operations()
    {
        return $this->hasMany(MutuelleOperation::class, 'affiliation_id');
    }
}
