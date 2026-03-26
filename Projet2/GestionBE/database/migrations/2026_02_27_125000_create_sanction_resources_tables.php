<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Table des types de sanction
        Schema::create('sanction_types', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        // Table des gravités
        Schema::create('sanction_gravites', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        // Table des statuts
        Schema::create('sanction_statuts', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        // Seed initial data - Types de sanction
        DB::table('sanction_types')->insert([
            ['nom' => 'Avertissement écrit', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Blâme', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Mise à pied', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Mutation disciplinaire', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Rétrogradation', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Licenciement disciplinaire', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Autre', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Seed initial data - Gravités
        DB::table('sanction_gravites')->insert([
            ['nom' => 'Faible', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Moyenne', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Grave', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Très grave', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Seed initial data - Statuts
        DB::table('sanction_statuts')->insert([
            ['nom' => 'En préparation', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Validée', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Appliquée', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Contestée', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Clôturée', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('sanction_statuts');
        Schema::dropIfExists('sanction_gravites');
        Schema::dropIfExists('sanction_types');
    }
};
