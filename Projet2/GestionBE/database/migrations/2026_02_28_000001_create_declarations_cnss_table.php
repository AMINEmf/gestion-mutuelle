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
        Schema::create('declarations_cnss', function (Blueprint $table) {
            $table->id();
            $table->integer('mois');
            $table->integer('annee');
            $table->decimal('montant_total', 12, 2)->default(0);
            $table->enum('statut', ['EN_ATTENTE', 'DECLARE', 'PAYE'])->default('EN_ATTENTE');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('declarations_cnss');
    }
};
