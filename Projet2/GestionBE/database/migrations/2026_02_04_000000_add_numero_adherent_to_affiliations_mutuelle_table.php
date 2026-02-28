<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('affiliations_mutuelle', function (Blueprint $table) {
            $table->string('numero_adherent')->nullable()->after('regime_mutuelle_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('affiliations_mutuelle', function (Blueprint $table) {
            $table->dropColumn('numero_adherent');
        });
    }
};
