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
        Schema::create('affiliations_mutuelle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employe_id')->constrained('employes')->onDelete('cascade');
            $table->foreignId('mutuelle_id')->constrained('mutuelles')->onDelete('cascade');
            $table->foreignId('regime_mutuelle_id')->constrained('regimes_mutuelle')->onDelete('cascade');
            $table->date('date_adhesion');
            $table->date('date_resiliation')->nullable();
            $table->boolean('ayant_droit')->default(false);
            $table->enum('statut', ['ACTIVE', 'RESILIE'])->default('ACTIVE');
            $table->text('commentaire')->nullable();
            $table->timestamps();
            
            // Index pour améliorer les performances
            $table->index(['employe_id', 'statut']);
            $table->index(['mutuelle_id', 'statut']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliations_mutuelle');
    }
};
