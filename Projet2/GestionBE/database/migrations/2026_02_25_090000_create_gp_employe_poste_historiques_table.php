<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gp_employe_poste_historiques', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employe_id');
            $table->unsignedBigInteger('poste_id')->nullable();
            $table->unsignedBigInteger('grade_id')->nullable();
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->string('type_evolution')->nullable();
            $table->timestamps();

            $table->index('employe_id');
            $table->index('poste_id');
            $table->index('grade_id');

            $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');
            $table->foreign('poste_id')->references('id')->on('gp_postes')->onDelete('set null');
            $table->foreign('grade_id')->references('id')->on('gp_grades')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gp_employe_poste_historiques');
    }
};
