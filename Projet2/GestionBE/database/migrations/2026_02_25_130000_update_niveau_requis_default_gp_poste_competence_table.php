<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Backfill existing rows
        DB::statement('UPDATE gp_poste_competence SET niveau_requis = 0 WHERE niveau_requis IS NULL');

        // Attempt to set default to 0 (safe even if already set)
        DB::statement('ALTER TABLE gp_poste_competence MODIFY niveau_requis TINYINT UNSIGNED NULL DEFAULT 0');
    }

    public function down(): void
    {
        // Revert default to NULL (keep data intact)
        DB::statement('ALTER TABLE gp_poste_competence MODIFY niveau_requis TINYINT UNSIGNED NULL DEFAULT NULL');
    }
};

