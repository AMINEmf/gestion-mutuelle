<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('demandes_mobilite')) {
            return;
        }

        Schema::create('demandes_mobilite', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employe_id')->constrained('employes')->cascadeOnDelete();
            $table->string('poste_actuel')->nullable();
            $table->string('departement_actuel')->nullable();
            $table->string('poste_souhaite');
            $table->string('type_mobilite', 100);
            $table->string('source_demande', 100)->nullable();
            $table->text('motivation');
            $table->date('disponibilite')->nullable();
            $table->text('avis_manager')->nullable();
            $table->string('cv_interne_path')->nullable();
            $table->string('cv_interne_nom_original')->nullable();
            $table->string('compatibilite_profil_poste')->nullable();
            $table->boolean('besoin_formation')->nullable();
            $table->text('details_formation')->nullable();
            $table->string('disponibilite_poste')->nullable();
            $table->text('impact_organisationnel')->nullable();
            $table->text('commentaire_rh')->nullable();
            $table->string('statut', 100)->default('En étude');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('rh_responsable')->nullable();
            $table->timestamps();

            // Evite les erreurs MySQL de clé composite trop longue en utf8mb4
            $table->index('statut');
            $table->index('type_mobilite');
            $table->index('disponibilite');
            $table->index('employe_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demandes_mobilite');
    }
};
