<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== DEPARTEMENTS ===\n";
$departements = DB::table('departements')->select('id', 'nom', 'parent_id')->get();
foreach ($departements as $dept) {
    $parent = $dept->parent_id ? " (parent: {$dept->parent_id})" : " (racine)";
    echo "ID: {$dept->id}, Nom: {$dept->nom}{$parent}\n";
}

echo "\n=== TEST API /api/postes ===\n";
echo "Sans filtre:\n";
$allPostes = DB::table('gp_postes')->count();
echo "Total: {$allPostes}\n";

echo "\nAvec unite_id=1:\n";
$postesUnite1 = DB::table('gp_postes')->where('unite_id', 1)->get(['id', 'nom']);
foreach ($postesUnite1 as $p) {
    echo "  - {$p->nom}\n";
}

echo "\nAvec unite_id=2:\n";
$postesUnite2 = DB::table('gp_postes')->where('unite_id', 2)->get(['id', 'nom']);
foreach ($postesUnite2 as $p) {
    echo "  - {$p->nom}\n";
}
