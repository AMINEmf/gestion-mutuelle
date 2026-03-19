<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Updating niveau_requis for Poste ID 9 (Developpeur Senior) ===\n\n";

// Update UI/UX (ID: 3) to niveau 3
DB::table('gp_poste_competence')
    ->where('poste_id', 9)
    ->where('competence_id', 3)
    ->update(['niveau_requis' => 3]);
echo "✓ UI/UX: niveau_requis = 3\n";

// Update HTML/CSS (ID: 4) to niveau 3
DB::table('gp_poste_competence')
    ->where('poste_id', 9)
    ->where('competence_id', 4)
    ->update(['niveau_requis' => 3]);
echo "✓ HTML/CSS: niveau_requis = 3\n";

// Update Laravel (ID: 5) to niveau 4
DB::table('gp_poste_competence')
    ->where('poste_id', 9)
    ->where('competence_id', 5)
    ->update(['niveau_requis' => 4]);
echo "✓ Laravel: niveau_requis = 4\n";

echo "\n=== Verification ===\n\n";

$competences = DB::table('gp_poste_competence')
    ->join('gp_competences', 'gp_poste_competence.competence_id', '=', 'gp_competences.id')
    ->where('gp_poste_competence.poste_id', 9)
    ->get(['gp_competences.id', 'gp_competences.nom', 'gp_poste_competence.niveau_requis']);

foreach ($competences as $comp) {
    echo "  - {$comp->nom} (ID: {$comp->id}): niveau_requis = {$comp->niveau_requis}\n";
}

echo "\n=== Done! ===\n";
