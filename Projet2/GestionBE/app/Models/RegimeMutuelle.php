<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegimeMutuelle extends Model
{
    use HasFactory;

    protected $table = 'regimes_mutuelle';

    protected $fillable = [
        'mutuelle_id',
        'libelle',
        'taux_couverture',
        'cotisation_mensuelle',
        'part_employeur_pct',
        'part_employe_pct',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
        'cotisation_mensuelle' => 'decimal:2',
        'part_employeur_pct' => 'decimal:2',
        'part_employe_pct' => 'decimal:2',
        'taux_couverture' => 'integer'
    ];

    /**
     * Un régime appartient à une mutuelle
     */
    public function mutuelle()
    {
        return $this->belongsTo(Mutuelle::class, 'mutuelle_id');
    }

    /**
     * Un régime a plusieurs affiliations
     */
    public function affiliations()
    {
        return $this->hasMany(AffiliationMutuelle::class, 'regime_mutuelle_id');
    }

    /**
     * Scope : Seulement les régimes actifs
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
