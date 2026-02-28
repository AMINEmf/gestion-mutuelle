<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConflitPieceJointe extends Model
{
    use HasFactory;

    protected $table = 'conflit_pieces_jointes';

    protected $fillable = [
        'conflit_id',
        'nom_fichier',
        'chemin_fichier',
        'type_fichier',
        'mime_type',
        'taille',
    ];

    public function conflit()
    {
        return $this->belongsTo(Conflit::class);
    }

    // Retourne l'URL publique du fichier
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->chemin_fichier);
    }

    // Formatage de la taille du fichier
    public function getTailleFormatteeAttribute()
    {
        $bytes = $this->taille;
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' B';
    }
}
