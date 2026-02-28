<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mutuelle_documents', function (Blueprint $table) {
            $table->string('type_document', 100)->nullable()->after('operation_id');
        });
    }

    public function down(): void
    {
        Schema::table('mutuelle_documents', function (Blueprint $table) {
            $table->dropColumn('type_document');
        });
    }
};
