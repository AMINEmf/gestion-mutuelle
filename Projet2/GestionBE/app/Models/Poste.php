<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Poste extends Model
{
    use HasFactory;

    protected $table = 'gp_postes';

    protected $fillable = [
        'nom',
        'unite_id',
    ];

    public function unite()
    {
        return $this->belongsTo(Unite::class, 'unite_id');
    }

    public function competences()
    {
        return $this->belongsToMany(GpCompetence::class, 'gp_poste_competence', 'poste_id', 'competence_id')
            ->withPivot(['niveau_requis', 'is_required'])
            ->withTimestamps();
    }
}
