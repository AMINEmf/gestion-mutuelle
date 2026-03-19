<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking poste competences ===\n\n";

$posteCompetences = DB::table('gp_poste_competence')
    ->join('gp_postes', 'gp_poste_competence.poste_id', '=', 'gp_postes.id')
    ->join('gp_competences', 'gp_poste_competence.competence_id', '=', 'gp_competences.id')
    ->select(
        'gp_postes.id as poste_id',
        'gp_postes.nom as poste_nom',
        'gp_competences.id as competence_id',
        'gp_competences.nom as competence_nom',
        'gp_poste_competence.niveau_requis',
        'gp_poste_competence.importance'
    )
    ->limit(10)
    ->get();

echo "Found " . $posteCompetences->count() . " competence associations:\n\n";

foreach ($posteCompetences as $pc) {
    echo "Poste ID: {$pc->poste_id} - {$pc->poste_nom}\n";
    echo "  Competence ID: {$pc->competence_id} - {$pc->competence_nom}\n";
    echo "  Niveau requis: {$pc->niveau_requis}\n";
    echo "  Importance: {$pc->importance}\n";
    echo "\n";
}

echo "\n=== Competences count per poste ===\n\n";

$counts = DB::table('gp_poste_competence')
    ->join('gp_postes', 'gp_poste_competence.poste_id', '=', 'gp_postes.id')
    ->select('gp_postes.id', 'gp_postes.nom', DB::raw('COUNT(*) as count'))
    ->groupBy('gp_postes.id', 'gp_postes.nom')
    ->get();

foreach ($counts as $count) {
    echo "Poste ID: {$count->id} - {$count->nom} : {$count->count} compétences\n";
}

if ($counts->isEmpty()) {
    echo "No competences assigned to any poste!\n";
}
