<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GpFormationCompetence extends Model
{
    use HasFactory;

    protected $table = 'gp_formation_competences';

    protected $fillable = [
        'formation_id',
        'competence_id',
        'niveau_cible',
        'poids',
    ];

    protected $casts = [
        'niveau_cible' => 'integer',
        'poids' => 'integer',
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    public function competence()
    {
        return $this->belongsTo(GpCompetence::class, 'competence_id');
    }
}
