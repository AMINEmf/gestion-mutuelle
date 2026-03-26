<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'titre',
        'domaine',
        'type',
        'mode_formation',
        'duree',
        'statut',
        'date_debut',
        'date_fin',
        'budget',
        'organisme',
        'effectif',
        'formateur_employe_id',
        'formateur_id',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function participants()
    {
        return $this->hasMany(FormationParticipant::class);
    }

    public function formateurEmploye()
    {
        return $this->belongsTo(Employe::class, 'formateur_employe_id');
    }

    public function formateur()
    {
        return $this->belongsTo(Formateur::class, 'formateur_id');
    }

    public function employes()
    {
        return $this->belongsToMany(Employe::class, 'formation_participants')
                    ->withPivot(['statut', 'note', 'commentaire', 'attestation'])
                    ->withTimestamps();
    }

    public function sessions()
    {
        return $this->hasMany(FormationSession::class);
    }

    /**
     * Skills taught by this formation.
     */
    public function competences()
    {
        return $this->belongsToMany(GpCompetence::class, 'gp_formation_competences', 'formation_id', 'competence_id')
                    ->withPivot(['niveau_cible', 'poids'])
                    ->withTimestamps();
    }

    /**
     * Compute attendance rate (0-100) for this formation.
     * total_expected = participants_count × sessions_count
     * total_present  = attendance rows where statut = 'Présent'
     */
    public function getAttendanceRateAttribute(): ?float
    {
        $sessionsCount    = $this->sessions()->count();
        $participantsCount = $this->participants()->count();
        $totalExpected    = $sessionsCount * $participantsCount;

        if ($totalExpected === 0) {
            return null;
        }

        $totalPresent = \App\Models\FormationAttendance::whereIn(
            'session_id',
            $this->sessions()->pluck('id')
        )
            ->where('statut', 'Présent')
            ->count();

        return round(($totalPresent / $totalExpected) * 100, 1);
    }
}
