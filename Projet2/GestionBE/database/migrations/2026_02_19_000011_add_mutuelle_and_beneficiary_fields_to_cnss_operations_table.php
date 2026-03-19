<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cnss_operations', function (Blueprint $table) {
            $table->string('beneficiary_type')->nullable()->after('date_operation');
            $table->string('beneficiary_name')->nullable()->after('beneficiary_type');
            $table->string('beneficiary_relation')->nullable()->after('beneficiary_name');

            $table->decimal('montant_total', 10, 2)->nullable()->after('montant');
            $table->decimal('taux_remboursement', 5, 2)->nullable()->after('montant_total');
            $table->decimal('montant_rembourse', 10, 2)->nullable()->after('taux_remboursement');
            $table->decimal('montant_reste_a_charge', 10, 2)->nullable()->after('montant_rembourse');
        });
    }

    public function down(): void
    {
        Schema::table('cnss_operations', function (Blueprint $table) {
            $table->dropColumn([
                'beneficiary_type',
                'beneficiary_name',
                'beneficiary_relation',
                'montant_total',
                'taux_remboursement',
                'montant_rembourse',
                'montant_reste_a_charge',
            ]);
        });
    }
};
