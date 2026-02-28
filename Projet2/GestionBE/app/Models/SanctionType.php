<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SanctionType extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function sanctions()
    {
        return $this->hasMany(Sanction::class, 'sanction_type_id');
    }
}
