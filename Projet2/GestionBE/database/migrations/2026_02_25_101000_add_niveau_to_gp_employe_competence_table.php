<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gp_employe_competence', function (Blueprint $table) {
            if (!Schema::hasColumn('gp_employe_competence', 'niveau')) {
                $table->integer('niveau')->nullable()->after('competence_id')->comment('0 to 5');
            }
        });

        DB::statement('UPDATE gp_employe_competence SET niveau = COALESCE(niveau, niveau_acquis, 0)');
    }

    public function down(): void
    {
        Schema::table('gp_employe_competence', function (Blueprint $table) {
            if (Schema::hasColumn('gp_employe_competence', 'niveau')) {
                $table->dropColumn('niveau');
            }
        });
    }
};
