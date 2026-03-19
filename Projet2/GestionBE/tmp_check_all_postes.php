<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== All Postes ===\n\n";

$postes = DB::table('gp_postes')->get(['id', 'nom']);

foreach ($postes as $poste) {
    echo "ID: {$poste->id} - {$poste->nom}\n";
}

echo "\n=== Poste 'Developpeur Senior' ===\n\n";

$poste = DB::table('gp_postes')
    ->where('nom', 'like', '%Senior%')
    ->first(['id', 'nom']);

if ($poste) {
    echo "Found: ID {$poste->id} - {$poste->nom}\n\n";
    
    echo "Competences requises:\n";
    $competences = DB::table('gp_poste_competence')
        ->join('gp_competences', 'gp_poste_competence.competence_id', '=', 'gp_competences.id')
        ->where('gp_poste_competence.poste_id', $poste->id)
        ->get(['gp_competences.id', 'gp_competences.nom', 'gp_poste_competence.niveau_requis']);
    
    if ($competences->isEmpty()) {
        echo "  No competences found for this poste\n";
    } else {
        foreach ($competences as $comp) {
            echo "  - {$comp->nom} (ID: {$comp->id}): niveau_requis = {$comp->niveau_requis}\n";
        }
    }
} else {
    echo "Poste 'Developpeur Senior' not found\n";
}
