<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Remove emploi_temps — replaced by the session-based planning system.
     */
    public function up(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropColumn('emploi_temps');
        });
    }

    /**
     * Restore the column for rollback purposes.
     */
    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->text('emploi_temps')->nullable()->after('effectif')
                ->comment('Emploi du temps / Planning de la formation (obsolète — utiliser formation_sessions)');
        });
    }
};
