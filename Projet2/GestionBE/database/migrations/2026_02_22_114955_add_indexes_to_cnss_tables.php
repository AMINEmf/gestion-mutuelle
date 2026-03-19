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
        $existingIndexes = function (string $tableName): array {
            return collect(\DB::select("SHOW INDEX FROM `{$tableName}`"))
                ->pluck('Key_name')->unique()->toArray();
        };

        $idx = $existingIndexes('declarations_cnss');
        Schema::table('declarations_cnss', function (Blueprint $table) use ($idx) {
            if (!in_array('declarations_cnss_mois_index', $idx)) {
                $table->index('mois');
            }
            if (!in_array('declarations_cnss_annee_index', $idx)) {
                $table->index('annee');
            }
        });

        $idx = $existingIndexes('details_declaration_cnss');
        Schema::table('details_declaration_cnss', function (Blueprint $table) use ($idx) {
            if (!in_array('details_declaration_cnss_employe_id_index', $idx)) {
                $table->index('employe_id');
            }
            if (!in_array('details_declaration_cnss_declaration_cnss_id_index', $idx)) {
                $table->index('declaration_cnss_id');
            }
        });

        if (Schema::hasTable('cnss_operations')) {
            $idx = $existingIndexes('cnss_operations');
            if (!in_array('cnss_operations_statut_index', $idx)) {
                // Préfixe 191 pour éviter "key too long" avec utf8mb4 VARCHAR(255)
                DB::statement('ALTER TABLE `cnss_operations` ADD INDEX `cnss_operations_statut_index` (`statut`(191))');
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('declarations_cnss', function (Blueprint $table) {
            $table->dropIndex(['mois']);
            $table->dropIndex(['annee']);
        });

        Schema::table('details_declaration_cnss', function (Blueprint $table) {
            $table->dropIndex(['employe_id']);
            $table->dropIndex(['declaration_cnss_id']);
        });

        Schema::table('cnss_operations', function (Blueprint $table) {
            $table->dropIndex(['statut']);
        });
    }
};
