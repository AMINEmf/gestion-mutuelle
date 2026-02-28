<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConflitType extends Model
{
    use HasFactory;

    protected $table = 'conflit_types';
    protected $fillable = ['nom'];
}
