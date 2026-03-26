<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sanction_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sanction_id')->constrained('sanctions')->cascadeOnDelete();
            $table->string('nom');
            $table->string('chemin');
            $table->string('type')->nullable(); // lettre_avertissement, decision_signee, preuve, rapport_rh
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sanction_documents');
    }
};
