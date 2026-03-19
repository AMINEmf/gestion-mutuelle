<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking postes data ===\n\n";

$postes = DB::table('gp_postes')
    ->leftJoin('gp_grades', 'gp_postes.grade_id', '=', 'gp_grades.id')
    ->leftJoin('gp_unites', 'gp_postes.unite_id', '=', 'gp_unites.id')
    ->leftJoin('departements', 'gp_unites.departement_id', '=', 'departements.id')
    ->select(
        'gp_postes.id',
        'gp_postes.nom as poste_nom',
        'gp_postes.statut',
        'gp_postes.niveau',
        'gp_postes.unite_id',
        'gp_grades.code as grade_code',
        'gp_grades.label as grade_label',
        'gp_unites.nom as unite_nom',
        'gp_unites.departement_id',
        'departements.nom as departement_nom'
    )
    ->get();

echo "Found " . $postes->count() . " postes:\n\n";

foreach ($postes as $poste) {
    echo "ID: {$poste->id}\n";
    echo "  Nom: {$poste->poste_nom}\n";
    echo "  Statut: {$poste->statut}\n";
    echo "  Niveau: {$poste->niveau}\n";
    echo "  Unite ID: {$poste->unite_id}\n";
    echo "  Unite: {$poste->unite_nom}\n";
    echo "  Departement ID: {$poste->departement_id}\n";
    echo "  Departement: {$poste->departement_nom}\n";
    echo "  Grade: {$poste->grade_code} - {$poste->grade_label}\n";
    echo "\n";
}

echo "\n=== Checking departements ===\n\n";

$depts = DB::table('departements')->select('id', 'nom')->get();
echo "Found " . $depts->count() . " departements:\n";
foreach ($depts as $dept) {
    echo "  ID: {$dept->id} - Nom: {$dept->nom}\n";
}

echo "\n=== Checking unites ===\n\n";

$unites = DB::table('gp_unites')
    ->leftJoin('departements', 'gp_unites.departement_id', '=', 'departements.id')
    ->select('gp_unites.id', 'gp_unites.nom', 'gp_unites.departement_id', 'departements.nom as dept_nom')
    ->get();

echo "Found " . $unites->count() . " unites:\n";
foreach ($unites as $unite) {
    echo "  ID: {$unite->id} - Nom: {$unite->nom} - Dept ID: {$unite->departement_id} - Dept: {$unite->dept_nom}\n";
}
