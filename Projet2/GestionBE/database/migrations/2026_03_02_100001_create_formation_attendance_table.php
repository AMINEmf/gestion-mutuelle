<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('formation_attendance')) {
            return;
        }
        Schema::create('formation_attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('formation_sessions')->onDelete('cascade');
            $table->foreignId('employe_id')->constrained('employes')->onDelete('cascade');
            $table->string('statut')->default('Présent'); // Présent, Absent, Retard
            $table->text('remarque')->nullable();
            $table->timestamps();

            $table->unique(['session_id', 'employe_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formation_attendance');
    }
};
