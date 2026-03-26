<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Table des lieux d'incident
        Schema::create('conflit_lieux', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        // Table des types d'incident (natures)
        Schema::create('conflit_types', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        // Table des statuts de dossier
        Schema::create('conflit_statuts', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        // Insérer les données par défaut
        DB::table('conflit_lieux')->insert([
            ['nom' => 'Bureau', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Atelier', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Extérieur', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Salle de réunion', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Parking', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('conflit_types')->insert([
            ['nom' => 'Conflit interne', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Conflit avec partie externe', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Incident comportemental', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Litige professionnel', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Harcèlement', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Non-respect des procédures', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Altercation verbale ou physique', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Autre', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('conflit_statuts')->insert([
            ['nom' => 'Nouveau', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'En étude', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'En enquête', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => "En attente d'informations", 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'En décision', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Clôturé', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('conflit_statuts');
        Schema::dropIfExists('conflit_types');
        Schema::dropIfExists('conflit_lieux');
    }
};
