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
        Schema::create('gp_employe_competence', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employe_id');
            $table->unsignedBigInteger('competence_id');
            $table->integer('niveau_acquis')->nullable()->comment('1 to 5');
            $table->date('date_acquisition')->nullable();
            $table->timestamps();

            $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');
            $table->foreign('competence_id')->references('id')->on('gp_competences')->onDelete('cascade');

            $table->unique(['employe_id', 'competence_id'], 'emp_comp_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gp_employe_competence');
    }
};
