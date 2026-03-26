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
        Schema::table('gp_postes', function (Blueprint $table) {
            if (!Schema::hasColumn('gp_postes', 'grade_id')) {
                $table->unsignedBigInteger('grade_id')->nullable();
            }
            if (!Schema::hasColumn('gp_postes', 'statut')) {
                $table->string('statut')->nullable()->default('actif');
            }
            if (!Schema::hasColumn('gp_postes', 'niveau')) {
                $table->string('niveau')->nullable();
            }
            if (!Schema::hasColumn('gp_postes', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('gp_postes', 'is_active')) {
                $table->boolean('is_active')->nullable()->default(true);
            }
            if (!Schema::hasColumn('gp_postes', 'code')) {
                $table->string('code')->nullable();
            }
        });

        $hasGradeId = Schema::hasColumn('gp_postes', 'grade_id');
        if ($hasGradeId) {
            $foreignExists = DB::select("
                SELECT CONSTRAINT_NAME
                FROM information_schema.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'gp_postes'
                  AND COLUMN_NAME = 'grade_id'
                  AND REFERENCED_TABLE_NAME = 'gp_grades'
                  AND CONSTRAINT_NAME = 'gp_postes_grade_id_foreign'
            ");

            if (empty($foreignExists)) {
                DB::statement('ALTER TABLE gp_postes ADD CONSTRAINT gp_postes_grade_id_foreign FOREIGN KEY (grade_id) REFERENCES gp_grades(id) ON DELETE SET NULL');
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gp_postes', function (Blueprint $table) {
            $table->dropForeign(['grade_id']);
            $table->dropColumn([
                'grade_id',
                'statut',
                'niveau',
                'description',
                'is_active',
                'code',
            ]);
        });
    }
};
