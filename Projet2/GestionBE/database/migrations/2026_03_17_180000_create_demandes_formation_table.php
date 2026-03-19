<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demandes_formation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employe_id')->constrained('employes')->cascadeOnDelete();
            $table->foreignId('manager_id')->nullable()->constrained('employes')->nullOnDelete();
            $table->foreignId('departement_id')->constrained('departements')->cascadeOnDelete();
            $table->string('formation_souhaitee');
            $table->text('objectif');
            $table->text('lien_poste')->nullable();
            $table->string('urgence');
            $table->decimal('cout_estime', 12, 2)->nullable();
            $table->string('source_demande')->nullable();
            $table->text('commentaire_rh')->nullable();
            $table->text('organisation_formation')->nullable();
            $table->text('inscription')->nullable();
            $table->text('suivi_participation')->nullable();
            $table->text('resultat')->nullable();
            $table->string('certificat_path')->nullable();
            $table->string('statut')->default('En étude');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['statut', 'urgence']);
            $table->index('departement_id');
            $table->index('employe_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demandes_formation');
    }
};
