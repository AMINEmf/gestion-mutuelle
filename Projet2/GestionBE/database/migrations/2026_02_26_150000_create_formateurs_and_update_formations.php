<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table for external trainers (formateurs externes)
        Schema::create('formateurs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // Add formateur columns to formations
        Schema::table('formations', function (Blueprint $table) {
            // For Interne: the trainer is an employee
            $table->unsignedBigInteger('formateur_employe_id')->nullable()->after('organisme');
            // For Externe: the trainer is from the formateurs table
            $table->unsignedBigInteger('formateur_id')->nullable()->after('formateur_employe_id');

            $table->foreign('formateur_employe_id')->references('id')->on('employes')->nullOnDelete();
            $table->foreign('formateur_id')->references('id')->on('formateurs')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropForeign(['formateur_employe_id']);
            $table->dropForeign(['formateur_id']);
            $table->dropColumn(['formateur_employe_id', 'formateur_id']);
        });

        Schema::dropIfExists('formateurs');
    }
};
