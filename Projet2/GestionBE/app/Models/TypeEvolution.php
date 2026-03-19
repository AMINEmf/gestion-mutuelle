<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeEvolution extends Model
{
    use HasFactory;

    protected $table = 'types_evolution';

    protected $fillable = ['name'];
}
