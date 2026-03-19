<?php
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Employe;

// Postes IT disponibles
$postesIT = [
    16 => 'Développeur Frontend Junior',
    17 => 'Développeur Backend Confirmé', 
    18 => 'Développeur Full Stack Senior',
    19 => 'Administrateur Systèmes',
    20 => 'Data Analyst Senior',
];

// Postes RH disponibles
$postesRH = [
    21 => 'Chargé de Recrutement Junior',
    22 => 'Responsable Recrutement',
    23 => 'Chargé de Formation',
    24 => 'Gestionnaire de Paie',
    25 => 'Manager RH',
];

echo "=== Assignation des postes aux employés ===\n\n";

// Employés du département IT (IDs 2-6)
$employesIT = [2, 3, 4, 5, 6];
$posteIdsIT = array_keys($postesIT);
foreach ($employesIT as $i => $empId) {
    $posteId = $posteIdsIT[$i % count($posteIdsIT)];
    $emp = Employe::find($empId);
    if ($emp) {
        $emp->poste_id = $posteId;
        $emp->save();
        echo "Employé {$emp->nom} (ID: $empId) => Poste: {$postesIT[$posteId]} (ID: $posteId)\n";
    }
}

echo "\n";

// Employés du département RH (IDs 7-11)
$employesRH = [7, 8, 9, 10, 11];
$posteIdsRH = array_keys($postesRH);
foreach ($employesRH as $i => $empId) {
    $posteId = $posteIdsRH[$i % count($posteIdsRH)];
    $emp = Employe::find($empId);
    if ($emp) {
        $emp->poste_id = $posteId;
        $emp->save();
        echo "Employé {$emp->nom} (ID: $empId) => Poste: {$postesRH[$posteId]} (ID: $posteId)\n";
    }
}

// Lourini Hiba (ID 12) - assigner un poste RH
$emp12 = Employe::find(12);
if ($emp12) {
    $emp12->poste_id = 25; // Manager RH
    $emp12->save();
    echo "\nEmployé {$emp12->nom} (ID: 12) => Poste: Manager RH (ID: 25)\n";
}

echo "\n=== Vérification ===\n";
$employes = Employe::with('poste')->orderBy('id')->get();
foreach ($employes as $e) {
    $posteName = $e->poste ? $e->poste->nom : 'AUCUN';
    echo "ID: {$e->id} | {$e->nom} => Poste: {$posteName}\n";
}
