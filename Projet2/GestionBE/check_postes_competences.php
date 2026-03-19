<?php
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== POSTES et leurs STATUTS ===\n";
$postes = DB::table('gp_postes')->get(['id', 'nom', 'statut']);
foreach ($postes as $p) {
    echo "ID: {$p->id} | {$p->nom} | Statut: '{$p->statut}'\n";
}

echo "\n=== COMPETENCES des POSTES (gp_poste_competence) ===\n";
$posteCompetences = DB::table('gp_poste_competence')
    ->join('gp_postes', 'gp_postes.id', '=', 'gp_poste_competence.poste_id')
    ->join('gp_competences', 'gp_competences.id', '=', 'gp_poste_competence.competence_id')
    ->select('gp_postes.nom as poste', 'gp_competences.nom as competence', 'gp_poste_competence.niveau_requis')
    ->get();

if ($posteCompetences->isEmpty()) {
    echo "AUCUNE compétence associée aux postes!\n";
} else {
    foreach ($posteCompetences as $pc) {
        echo "{$pc->poste} => {$pc->competence} (Niveau requis: {$pc->niveau_requis})\n";
    }
}

echo "\n=== STRUCTURE de la table gp_poste_competence ===\n";
$columns = DB::select("DESCRIBE gp_poste_competence");
foreach ($columns as $col) {
    echo "{$col->Field} ({$col->Type}) - {$col->Null}\n";
}

echo "\n=== VALEURS STATUT distinctes ===\n";
$statuts = DB::table('gp_postes')->distinct()->pluck('statut');
echo "Valeurs: " . json_encode($statuts) . "\n";
