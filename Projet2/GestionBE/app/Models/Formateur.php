<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formateur extends Model
{
    use HasFactory;

    protected $table = 'formateurs';

    protected $fillable = ['name'];

    public function formations()
    {
        return $this->hasMany(Formation::class, 'formateur_id');
    }
}
