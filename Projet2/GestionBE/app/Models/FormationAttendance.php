<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormationAttendance extends Model
{
    use HasFactory;

    protected $table = 'formation_attendance';

    protected $fillable = [
        'session_id',
        'employe_id',
        'statut',
        'remarque',
    ];

    public function session()
    {
        return $this->belongsTo(FormationSession::class, 'session_id');
    }

    public function employe()
    {
        return $this->belongsTo(Employe::class, 'employe_id');
    }
}
