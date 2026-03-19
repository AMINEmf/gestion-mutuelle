<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== POSTES ===\n";
$postes = DB::table('gp_postes')->select('id', 'nom', 'unite_id')->get();
foreach ($postes as $poste) {
    echo "ID: {$poste->id}, Nom: {$poste->nom}, Unite: {$poste->unite_id}\n";
}

echo "\n=== UNITES ===\n";
$unites = DB::table('gp_unites')->select('id', 'nom')->get();
foreach ($unites as $unite) {
    echo "ID: {$unite->id}, Nom: {$unite->nom}\n";
}

echo "\n=== SERVICES ===\n";
$services = DB::table('gp_services')->select('id', 'nom')->get();
foreach ($services as $service) {
    echo "ID: {$service->id}, Nom: {$service->nom}\n";
}
