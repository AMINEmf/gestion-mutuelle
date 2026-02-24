<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mutuelle_operations', function (Blueprint $table) {
            $table->string('lien_parente', 191)->nullable()->after('beneficiaire_nom');
        });

        DB::table('mutuelle_operations')
            ->where('beneficiaire_type', 'EMPLOYE')
            ->whereNull('lien_parente')
            ->update(['lien_parente' => 'Employé']);

        DB::table('mutuelle_operations')
            ->where('beneficiaire_type', 'CONJOINT')
            ->whereNull('lien_parente')
            ->update(['lien_parente' => 'Conjoint(e)']);

        DB::table('mutuelle_operations')
            ->where('beneficiaire_type', 'ENFANT')
            ->whereNull('lien_parente')
            ->update(['lien_parente' => 'Enfant']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mutuelle_operations', function (Blueprint $table) {
            $table->dropColumn('lien_parente');
        });
    }
};
