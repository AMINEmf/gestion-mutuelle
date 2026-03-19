<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GpCompetence extends Model
{
    use HasFactory;

    protected $table = 'gp_competences';

    protected $fillable = [
        'nom',
        'categorie',
        'description',
    ];

    public function postes()
    {
        return $this->belongsToMany(Poste::class, 'gp_poste_competence', 'competence_id', 'poste_id')
            ->withPivot(['niveau_requis', 'is_required'])
            ->withTimestamps();
    }

    public function employes()
    {
        return $this->belongsToMany(Employe::class, 'gp_employe_competence', 'competence_id', 'employe_id')
            ->withPivot(['niveau', 'niveau_acquis', 'date_acquisition'])
            ->withTimestamps();
    }

    public function formations()
    {
        return $this->belongsToMany(Formation::class, 'gp_formation_competences', 'competence_id', 'formation_id')
            ->withPivot(['niveau_cible', 'poids'])
            ->withTimestamps();
    }
}
