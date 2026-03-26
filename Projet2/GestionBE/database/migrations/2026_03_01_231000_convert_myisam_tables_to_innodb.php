<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tables observed as MyISAM in this project.
     *
     * Keeping this explicit avoids touching unrelated legacy tables.
     *
     * @var array<int, string>
     */
    private array $tables = [
        'cnss_affiliations',
        'cnss_documents',
        'cnss_operations',
        'declarations_cnss',
        'details_declaration_cnss',
        'employe_competence',
        'formateurs',
        'formation_participants',
        'formations',
        'gp_competences',
        'gp_employe_competence',
        'gp_employe_poste_historiques',
        'gp_poste_competence',
        'types_evolution',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->tables as $table) {
            if (!Schema::hasTable($table)) {
                continue;
            }

            $engineRow = DB::selectOne(
                "SELECT ENGINE FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?",
                [$table]
            );

            $engine = strtoupper((string) ($engineRow->ENGINE ?? ''));
            if ($engine === 'INNODB') {
                continue;
            }

            DB::statement(sprintf('ALTER TABLE `%s` ENGINE=InnoDB', $table));
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally no-op: reverting to MyISAM is not desirable.
    }
};

