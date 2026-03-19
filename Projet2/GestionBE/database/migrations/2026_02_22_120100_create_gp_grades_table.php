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
        if (Schema::hasTable('gp_grades')) {
            $indexes = DB::select("SHOW INDEX FROM gp_grades WHERE Key_name = 'gp_grades_code_unique'");
            if (empty($indexes)) {
                DB::statement('CREATE UNIQUE INDEX gp_grades_code_unique ON gp_grades (code(50))');
            }
            return;
        }

        Schema::create('gp_grades', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('label');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unique('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gp_grades');
    }
};
