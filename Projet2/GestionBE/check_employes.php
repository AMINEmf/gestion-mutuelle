<?php
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Employe;

echo "=== Tous les employés dans la base de données ===\n";
$employes = Employe::orderBy('id')->get(['id', 'nom', 'prenom', 'matricule', 'poste_id']);
echo "Total: " . $employes->count() . " employés\n\n";

foreach ($employes as $e) {
    $posteInfo = $e->poste_id ? "Poste ID: {$e->poste_id}" : "PAS DE POSTE";
    echo "ID: {$e->id} | {$e->nom} {$e->prenom} | {$posteInfo}\n";
}

echo "\n=== ID Max: " . Employe::max('id') . " ===\n";
