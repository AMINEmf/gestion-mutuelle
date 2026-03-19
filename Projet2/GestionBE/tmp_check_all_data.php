<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Vérification complète des données ===\n\n";

try {
    $tables = ['employes', 'departements', 'gp_postes', 'users', 'gp_employe_poste_historiques', 'gp_competences'];
    
    foreach ($tables as $table) {
        try {
            $count = DB::table($table)->count();
            $status = $count > 0 ? "✓" : "❌";
            echo "{$status} {$table}: {$count} enregistrements\n";
        } catch (\Exception $e) {
            echo "❌ {$table}: ERREUR - " . $e->getMessage() . "\n";
        }
    }
    
    echo "\n=== Vérification des migrations récentes ===\n";
    $migrations = DB::table('migrations')->orderBy('id', 'desc')->limit(10)->get();
    foreach ($migrations as $mig) {
        echo "  - {$mig->migration} (batch: {$mig->batch})\n";
    }

} catch (\Exception $e) {
    echo "\n❌ ERREUR: " . $e->getMessage() . "\n";
}
