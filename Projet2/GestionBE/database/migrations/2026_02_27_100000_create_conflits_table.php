<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conflits', function (Blueprint $table) {
            $table->id();
            
            // Section 1: Informations générales
            $table->string('employe'); // Nom de l'employé concerné
            $table->string('matricule');
            $table->string('departement')->nullable();
            $table->string('poste')->nullable();
            $table->date('date_incident');
            $table->string('lieu_incident'); // bureau, site, extérieur...
            
            // Section 2: Nature du conflit/incident
            $table->enum('nature_conflit', [
                'conflit_interne',
                'conflit_externe',
                'incident_comportemental',
                'litige_professionnel',
                'harcelement',
                'non_respect_procedures',
                'altercation',
                'autre'
            ]);
            
            // Section 3: Partie impliquée
            $table->string('partie_nom')->nullable(); // Nom/Désignation
            $table->enum('partie_type', ['interne', 'externe'])->nullable();
            $table->string('partie_fonction')->nullable(); // Fonction ou relation
            $table->string('partie_organisation')->nullable(); // Si externe
            
            // Section 4: Description
            $table->text('description')->nullable();
            $table->text('temoins')->nullable();
            $table->text('circonstances')->nullable();
            
            // Section 5: Évaluation RH
            $table->enum('gravite', ['faible', 'moyen', 'eleve', 'critique'])->default('faible');
            $table->enum('confidentialite', ['normal', 'sensible'])->default('normal');
            
            // Section 7: Suivi du dossier
            $table->enum('statut', [
                'nouveau',
                'en_etude',
                'en_enquete',
                'en_attente',
                'en_decision',
                'cloture'
            ])->default('nouveau');
            $table->string('responsable_rh')->nullable();
            $table->text('commentaires_rh')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conflits');
    }
};
