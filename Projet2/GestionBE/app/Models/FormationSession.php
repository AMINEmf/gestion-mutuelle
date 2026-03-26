<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormationSession extends Model
{
    use HasFactory;

    protected $table = 'formation_sessions';

    protected $fillable = [
        'formation_id',
        'date',
        'heure_debut',
        'heure_fin',
        'salle',
        'statut',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    public function attendance()
    {
        return $this->hasMany(FormationAttendance::class, 'session_id');
    }

    /**
     * Auto-create attendance rows for all formation participants.
     * Called after a session is created.
     */
    public function createAttendanceForParticipants(): void
    {
        $participantIds = $this->formation
            ->participants()
            ->pluck('employe_id');

        $records = $participantIds->map(fn ($empId) => [
            'session_id'  => $this->id,
            'employe_id'  => $empId,
            'statut'      => 'Présent',
            'remarque'    => null,
            'created_at'  => now(),
            'updated_at'  => now(),
        ])->toArray();

        if (!empty($records)) {
            FormationAttendance::upsert(
                $records,
                ['session_id', 'employe_id'],
                ['statut', 'updated_at']
            );
        }
    }
}
