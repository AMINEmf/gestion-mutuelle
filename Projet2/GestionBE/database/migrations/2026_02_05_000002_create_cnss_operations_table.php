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
        Schema::create('cnss_operations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employe_id')->constrained('employes')->cascadeOnDelete();
            $table->string('type_operation');
            $table->date('date_operation');
            $table->string('beneficiary_type')->nullable();
            $table->string('beneficiary_name')->nullable();
            $table->string('beneficiary_relation')->nullable();
            $table->string('reference')->nullable();
            $table->decimal('montant', 12, 2)->nullable();
            $table->decimal('montant_total', 10, 2)->nullable();
            $table->decimal('taux_remboursement', 5, 2)->nullable();
            $table->decimal('montant_rembourse', 10, 2)->nullable();
            $table->decimal('montant_reste_a_charge', 10, 2)->nullable();
            $table->string('statut');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('employe_id');
            $table->index('date_operation');
            $table->index('statut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cnss_operations');
    }
};
