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
        'grade_id',
        'statut',
        'niveau',
        'domaine',
        'description',
        'is_active',
        'code',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function unite()
    {
        return $this->belongsTo(Unite::class, 'unite_id');
    }

    public function grade()
    {
        return $this->belongsTo(GpGrade::class, 'grade_id');
    }

    public function competences()
    {
        return $this->belongsToMany(GpCompetence::class, 'gp_poste_competence', 'poste_id', 'competence_id')
            ->withPivot(['niveau_requis', 'is_required'])
            ->withTimestamps();
    }

    public function employes()
    {
        return $this->hasMany(Employe::class, 'poste_id');
    }

    public function employePosteHistoriques()
    {
        return $this->hasMany(GpEmployePosteHistorique::class, 'poste_id');
    }
}
