<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Add 'Accepté' to statut ENUM values
     */
    public function up(): void
    {
        if (!Schema::hasTable('gp_employe_poste_historiques')) {
            return;
        }

        if (!Schema::hasColumn('gp_employe_poste_historiques', 'statut')) {
            DB::statement("ALTER TABLE gp_employe_poste_historiques ADD COLUMN statut ENUM('Proposé', 'Accepté', 'Validé', 'Refusé', 'Expiré') NOT NULL DEFAULT 'Validé' COMMENT 'Statut de validation du poste assigné'");
            return;
        }

        // Ajouter 'Accepté' à l'ENUM existant
        DB::statement("ALTER TABLE gp_employe_poste_historiques MODIFY COLUMN statut ENUM('Proposé', 'Accepté', 'Validé', 'Refusé', 'Expiré') NOT NULL DEFAULT 'Validé' COMMENT 'Statut de validation du poste assigné'");
    }

    /**
     * Reverse the migration
     */
    public function down(): void
    {
        if (!Schema::hasTable('gp_employe_poste_historiques') || !Schema::hasColumn('gp_employe_poste_historiques', 'statut')) {
            return;
        }

        // Retirer 'Accepté' de l'ENUM
        DB::statement("ALTER TABLE gp_employe_poste_historiques MODIFY COLUMN statut ENUM('Proposé', 'Validé', 'Refusé', 'Expiré') NOT NULL DEFAULT 'Validé' COMMENT 'Statut de validation du poste assigné'");
    }
};
