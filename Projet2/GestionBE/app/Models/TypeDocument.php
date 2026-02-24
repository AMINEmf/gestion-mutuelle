<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
    ];

    /**
     * Get the documents associated with this type.
     */
    public function documents()
    {
        // Supposons qu'il y aura un champ type_document_id dans mutuelle_documents
        return $this->hasMany(MutuelleDocument::class, 'type_document_id');
    }
}
