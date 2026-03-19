<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking competences 3, 4, 5 in database ===\n\n";

$competences = DB::table('gp_competences')
    ->whereIn('id', [3, 4, 5])
    ->get(['id', 'nom', 'categorie']);

foreach ($competences as $comp) {
    echo "ID: {$comp->id} - {$comp->nom} ({$comp->categorie})\n";
}

echo "\n=== Which postes have these competences? ===\n\n";

$posteCompetences = DB::table('gp_poste_competence')
    ->whereIn('competence_id', [3, 4, 5])
    ->get(['poste_id', 'competence_id', 'niveau_requis']);

foreach ($posteCompetences as $pc) {
    $poste = DB::table('gp_postes')->where('id', $pc->poste_id)->first(['nom']);
    $comp = DB::table('gp_competences')->where('id', $pc->competence_id)->first(['nom']);
    echo "Poste '{$poste->nom}' (ID: {$pc->poste_id}) -> {$comp->nom} (ID: {$pc->competence_id}) : niveau_requis = {$pc->niveau_requis}\n";
}
