<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('titre');
            $table->string('domaine')->nullable();
            $table->string('type')->nullable(); // Interne, Externe
            $table->string('duree')->nullable();
            $table->string('statut')->default('Planifie'); // Planifie, En cours, Termine, Annule
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->decimal('budget', 12, 2)->nullable();
            $table->string('organisme')->nullable();
            $table->timestamps();
        });

        Schema::create('formation_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formation_id')->constrained('formations')->onDelete('cascade');
            $table->foreignId('employe_id')->constrained('employes')->onDelete('cascade');
            $table->string('statut')->default('En attente'); // En attente, En cours, Termine, Annule
            $table->string('note')->nullable();
            $table->text('commentaire')->nullable();
            $table->string('attestation')->nullable();
            $table->timestamps();

            $table->unique(['formation_id', 'employe_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formation_participants');
        Schema::dropIfExists('formations');
    }
};
