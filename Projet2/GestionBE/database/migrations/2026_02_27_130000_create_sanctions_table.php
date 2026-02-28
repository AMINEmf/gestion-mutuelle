<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sanctions', function (Blueprint $table) {
            $table->id();
            
            // Section 1: Informations générales
            $table->string('employe'); // Nom de l'employé concerné
            $table->string('matricule');
            $table->date('date_sanction');
            $table->string('reference_dossier')->nullable(); // Référence si lié à un conflit
            $table->foreignId('departement_id')->nullable()->constrained('departements')->nullOnDelete();
            
            // Section 2: Type de sanction (via foreign key)
            $table->foreignId('sanction_type_id')->nullable()->constrained('sanction_types')->nullOnDelete();
            
            // Section 3: Motif
            $table->text('motif_description')->nullable(); // Description détaillée du motif
            $table->text('rappel_faits')->nullable(); // Rappel des faits
            $table->foreignId('conflit_id')->nullable()->constrained('conflits')->nullOnDelete(); // Lien avec conflit
            
            // Section 4: Gravité (via foreign key)
            $table->foreignId('sanction_gravite_id')->nullable()->constrained('sanction_gravites')->nullOnDelete();
            
            // Section 5: Détails d'application
            $table->integer('duree_jours')->nullable(); // Durée si mise à pied
            $table->boolean('impact_salaire')->default(false);
            $table->date('date_effet')->nullable();
            $table->date('date_fin')->nullable();
            
            // Section 6: Statut (via foreign key)
            $table->foreignId('sanction_statut_id')->nullable()->constrained('sanction_statuts')->nullOnDelete();
            
            // Commentaires RH
            $table->text('commentaires_rh')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sanctions');
    }
};
