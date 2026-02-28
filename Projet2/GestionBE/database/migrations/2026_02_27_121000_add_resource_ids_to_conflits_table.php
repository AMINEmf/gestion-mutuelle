<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('conflits', function (Blueprint $table) {
            // Ajouter les colonnes de référence aux ressources
            $table->unsignedBigInteger('conflit_lieu_id')->nullable()->after('date_incident');
            $table->unsignedBigInteger('conflit_type_id')->nullable()->after('conflit_lieu_id');
            $table->unsignedBigInteger('conflit_statut_id')->nullable()->after('confidentialite');
            
            // Optionnel: ajouter les contraintes de clé étrangère
            // $table->foreign('conflit_lieu_id')->references('id')->on('conflit_lieux')->onDelete('set null');
            // $table->foreign('conflit_type_id')->references('id')->on('conflit_types')->onDelete('set null');
            // $table->foreign('conflit_statut_id')->references('id')->on('conflit_statuts')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('conflits', function (Blueprint $table) {
            $table->dropColumn(['conflit_lieu_id', 'conflit_type_id', 'conflit_statut_id']);
        });
    }
};
