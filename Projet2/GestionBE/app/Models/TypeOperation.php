<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeOperation extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'necessite_montant',
    ];

    /**
     * Get the operations associated with this type.
     */
    public function operations()
    {
        return $this->hasMany(MutuelleOperation::class, 'type_operation_id');
    }
}
