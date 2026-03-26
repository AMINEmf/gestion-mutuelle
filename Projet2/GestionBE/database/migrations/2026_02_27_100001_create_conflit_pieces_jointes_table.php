<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conflit_pieces_jointes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conflit_id')->constrained('conflits')->onDelete('cascade');
            $table->string('nom_fichier'); // Nom original du fichier
            $table->string('chemin_fichier'); // Chemin de stockage
            $table->string('type_fichier')->nullable(); // photo, email, rapport, temoignage, autre
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('taille')->nullable(); // Taille en bytes
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conflit_pieces_jointes');
    }
};
