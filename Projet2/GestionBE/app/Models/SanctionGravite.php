<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SanctionGravite extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function sanctions()
    {
        return $this->hasMany(Sanction::class, 'sanction_gravite_id');
    }
}
