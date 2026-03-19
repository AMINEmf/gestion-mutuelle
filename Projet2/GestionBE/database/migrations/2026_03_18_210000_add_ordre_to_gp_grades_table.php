<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('gp_grades', 'ordre')) {
            Schema::table('gp_grades', function (Blueprint $table) {
                $table->integer('ordre')->default(0)->after('code');
            });
        }

        DB::table('gp_grades')->where('code', 'JR')->update(['ordre' => 1]);
        DB::table('gp_grades')->where('code', 'CF')->update(['ordre' => 2]);
        DB::table('gp_grades')->where('code', 'SR')->update(['ordre' => 3]);
        DB::table('gp_grades')->where('code', 'EXP')->update(['ordre' => 4]);
        DB::table('gp_grades')->where('code', 'MGR')->update(['ordre' => 5]);
        DB::table('gp_grades')->where('code', 'DIR')->update(['ordre' => 6]);

        DB::table('gp_grades')->whereNull('ordre')->update(['ordre' => 0]);
    }

    public function down(): void
    {
        if (Schema::hasColumn('gp_grades', 'ordre')) {
            Schema::table('gp_grades', function (Blueprint $table) {
                $table->dropColumn('ordre');
            });
        }
    }
};
