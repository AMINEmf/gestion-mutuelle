<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('employes', 'manager_id')) {
            Schema::table('employes', function (Blueprint $table) {
                $table->foreignId('manager_id')
                    ->nullable()
                    ->after('poste_id')
                    ->constrained('employes')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('employes', 'manager_id')) {
            Schema::table('employes', function (Blueprint $table) {
                $table->dropConstrainedForeignId('manager_id');
            });
        }
    }
};
