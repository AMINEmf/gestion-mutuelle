<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormationParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'formation_id',
        'employe_id',
        'statut',
        'note',
        'commentaire',
        'attestation',
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }
}
