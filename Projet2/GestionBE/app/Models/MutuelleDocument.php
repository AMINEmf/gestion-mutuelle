<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutuelleDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'employe_id',
        'operation_id',
        'type_document',
        'nom',
        'file_path',
        'file_name',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class, 'employe_id');
    }

    public function operation()
    {
        return $this->belongsTo(MutuelleOperation::class, 'operation_id');
    }
}
