<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gp_formation_competences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formation_id')->constrained('formations')->onDelete('cascade');
            $table->foreignId('competence_id')->constrained('gp_competences')->onDelete('cascade');
            $table->unsignedTinyInteger('niveau_cible')->nullable()->comment('Target skill level 1-5');
            $table->unsignedTinyInteger('poids')->default(3)->comment('Importance weight 1-5');
            $table->timestamps();

            $table->unique(['formation_id', 'competence_id']);
            $table->index('formation_id');
            $table->index('competence_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gp_formation_competences');
    }
};
