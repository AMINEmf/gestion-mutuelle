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
        Schema::create('gp_poste_competence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poste_id')->constrained('gp_postes')->cascadeOnDelete();
            $table->foreignId('competence_id')->constrained('gp_competences')->cascadeOnDelete();
            $table->unsignedTinyInteger('niveau_requis')->nullable();
            $table->boolean('is_required')->default(true);
            $table->timestamps();

            $table->unique(['poste_id', 'competence_id']);
            $table->index('poste_id');
            $table->index('competence_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gp_poste_competence');
    }
};
