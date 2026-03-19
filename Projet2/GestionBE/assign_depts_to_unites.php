<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== ASSIGNATION DES DÉPARTEMENTS AUX UNITÉS ===\n";

// Assigner le département INFO (id=1) aux unités de développement (1,2)
DB::table('gp_unites')->where('id', 1)->update(['departement_id' => 1]); // Unité Développement → INFO
DB::table('gp_unites')->where('id', 2)->update(['departement_id' => 1]); // Unité Data → INFO

// Assigner le département RH (id=11) aux unités RH
DB::table('gp_unites')->where('id', 3)->update(['departement_id' => 11]); // Unité Gestion du Personnel → RH

// Assigner le département IT (id=10) à la comptabilité (temporaire)
DB::table('gp_unites')->where('id', 4)->update(['departement_id' => 10]); // Unité Comptabilité → IT

echo "Unités mises à jour:\n";
$unites = DB::table('gp_unites')->get(['id', 'nom', 'departement_id']);
foreach ($unites as $unite) {
    echo "  - {$unite->nom} (unite_id: {$unite->id}) → dept_id: {$unite->departement_id}\n";
}

echo "\nPOSTES PAR DÉPARTEMENT:\n";
$postes = DB::table('gp_postes as p')
    ->join('gp_unites as u', 'p.unite_id', '=', 'u.id')
    ->select('p.nom as poste_nom', 'u.nom as unite_nom', 'u.departement_id')
    ->get();

$byDept = [];
foreach ($postes as $poste) {
    $deptId = $poste->departement_id ?? 'NULL';
    if (!isset($byDept[$deptId])) {
        $byDept[$deptId] = [];
    }
    $byDept[$deptId][] = $poste->poste_nom;
}

foreach ($byDept as $deptId => $postesList) {
    echo "\nDépartement ID {$deptId}:\n";
    foreach ($postesList as $posteName) {
        echo "  - {$posteName}\n";
    }
}
