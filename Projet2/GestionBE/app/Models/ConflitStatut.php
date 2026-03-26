<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConflitStatut extends Model
{
    use HasFactory;

    protected $table = 'conflit_statuts';
    protected $fillable = ['nom'];
}
