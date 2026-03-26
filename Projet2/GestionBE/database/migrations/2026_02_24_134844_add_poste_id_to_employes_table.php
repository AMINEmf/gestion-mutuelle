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
        Schema::table('employes', function (Blueprint $table) {
            $table->unsignedBigInteger('poste_id')->nullable()->after('departement_id');
            // Assuming gp_postes is the table for Poste model
            if (Schema::hasTable('gp_postes')) {
                $table->foreign('poste_id')->references('id')->on('gp_postes')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employes', function (Blueprint $table) {
            if (Schema::hasColumn('employes', 'poste_id')) {
                 // Check if foreign key exists before dropping - strictly speaking not easy without knowing constraint name but dropForeign works with array syntax
                 try {
                    $table->dropForeign(['poste_id']);
                 } catch (\Exception $e) {}
                 $table->dropColumn('poste_id');
            }
        });
    }
};
