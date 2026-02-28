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
        Schema::table('type_operations', function (Blueprint $table) {
            $table->boolean('necessite_montant')->default(false)->after('label');
        });

        // Seed existing data
        $financialKeywords = ['rembourse', 'charge', 'regularisation', 'régularisation'];
        
        $types = \DB::table('type_operations')->get();
        foreach ($types as $type) {
            foreach ($financialKeywords as $keyword) {
                if (stripos($type->label, $keyword) !== false) {
                    \DB::table('type_operations')
                        ->where('id', $type->id)
                        ->update(['necessite_montant' => true]);
                    break;
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('type_operations', function (Blueprint $table) {
            $table->dropColumn('necessite_montant');
        });
    }
};
