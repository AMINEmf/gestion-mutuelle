<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GpGrade extends Model
{
    use HasFactory;

    protected $table = 'gp_grades';

    protected $fillable = [
        'code',
        'ordre',
        'label',
        'description',
    ];

    protected $casts = [
        'ordre' => 'integer',
    ];

    public function postes()
    {
        return $this->hasMany(Poste::class, 'grade_id');
    }

    public function employePosteHistoriques()
    {
        return $this->hasMany(GpEmployePosteHistorique::class, 'grade_id');
    }
}
