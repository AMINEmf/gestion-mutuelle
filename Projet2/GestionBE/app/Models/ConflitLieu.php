<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConflitLieu extends Model
{
    use HasFactory;

    protected $table = 'conflit_lieux';
    protected $fillable = ['nom'];
}
