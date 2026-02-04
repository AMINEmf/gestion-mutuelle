<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mutuelle extends Model
{
    use HasFactory;

    protected $table = 'mutuelles';

    protected $fillable = [
        'nom',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean'
    ];

    /**
     * Une mutuelle a plusieurs régimes
     */
    public function regimes()
    {
        return $this->hasMany(RegimeMutuelle::class, 'mutuelle_id');
    }

    /**
     * Une mutuelle a plusieurs affiliations
     */
    public function affiliations()
    {
        return $this->hasMany(AffiliationMutuelle::class, 'mutuelle_id');
    }

    /**
     * Scope : Seulement les mutuelles actives
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
