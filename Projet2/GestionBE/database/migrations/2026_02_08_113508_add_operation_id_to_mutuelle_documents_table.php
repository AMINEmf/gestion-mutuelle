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
        Schema::table('mutuelle_documents', function (Blueprint $table) {
            $table->unsignedBigInteger('operation_id')->nullable()->after('id');
            $table->index('operation_id');
            $table->foreign('operation_id')
                  ->references('id')
                  ->on('mutuelle_operations')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mutuelle_documents', function (Blueprint $table) {
            $table->dropForeign(['operation_id']);
            $table->dropIndex(['operation_id']);
            $table->dropColumn('operation_id');
        });
    }
};
