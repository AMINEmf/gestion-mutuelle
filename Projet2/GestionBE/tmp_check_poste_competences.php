<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking gp_poste_competence table for poste_id = 4 ===\n\n";

$rows = DB::table('gp_poste_competence')
    ->where('poste_id', 4)
    ->get(['poste_id', 'competence_id', 'niveau_requis']);

foreach ($rows as $row) {
    echo "Poste ID: {$row->poste_id}, Competence ID: {$row->competence_id}, Niveau Requis: {$row->niveau_requis}\n";
}

echo "\n=== Checking with Eloquent ===\n\n";

$poste = App\Models\Poste::with('competences')->find(4);

if ($poste) {
    echo "Poste: {$poste->nom}\n";
    echo "Competences:\n";
    foreach ($poste->competences as $comp) {
        echo "  - {$comp->nom}: niveau_requis = {$comp->pivot->niveau_requis}\n";
    }
} else {
    echo "Poste not found\n";
}
