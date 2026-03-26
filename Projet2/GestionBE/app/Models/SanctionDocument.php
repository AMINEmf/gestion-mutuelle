<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SanctionDocument extends Model
{
    use HasFactory;

    protected $fillable = ['sanction_id', 'nom', 'chemin', 'type'];

    public function sanction()
    {
        return $this->belongsTo(Sanction::class);
    }
}
