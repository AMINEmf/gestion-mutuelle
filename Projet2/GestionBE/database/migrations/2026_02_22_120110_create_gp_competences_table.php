<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('gp_competences')) {
            $indexes = DB::select("SHOW INDEX FROM gp_competences WHERE Key_name = 'gp_competences_nom_categorie_unique'");
            if (empty($indexes)) {
                DB::statement('CREATE UNIQUE INDEX gp_competences_nom_categorie_unique ON gp_competences (nom(100), categorie(100))');
            }
            return;
        }

        Schema::create('gp_competences', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('categorie', 100)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unique(['nom', 'categorie']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gp_competences');
    }
};
