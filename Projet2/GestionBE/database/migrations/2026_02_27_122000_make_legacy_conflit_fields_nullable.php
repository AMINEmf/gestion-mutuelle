<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conflits', function (Blueprint $table) {
            // Make old text fields nullable since we now use foreign keys
            $table->string('lieu_incident')->nullable()->change();
            $table->enum('nature_conflit', [
                'conflit_interne',
                'conflit_externe',
                'incident_comportemental',
                'litige_professionnel',
                'harcelement',
                'non_respect_procedures',
                'altercation',
                'autre'
            ])->nullable()->change();
            $table->enum('statut', [
                'nouveau',
                'en_etude',
                'en_enquete',
                'en_attente',
                'en_decision',
                'cloture'
            ])->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('conflits', function (Blueprint $table) {
            $table->string('lieu_incident')->nullable(false)->change();
            $table->enum('nature_conflit', [
                'conflit_interne',
                'conflit_externe',
                'incident_comportemental',
                'litige_professionnel',
                'harcelement',
                'non_respect_procedures',
                'altercation',
                'autre'
            ])->nullable(false)->change();
            $table->enum('statut', [
                'nouveau',
                'en_etude',
                'en_enquete',
                'en_attente',
                'en_decision',
                'cloture'
            ])->nullable(false)->change();
        });
    }
};
