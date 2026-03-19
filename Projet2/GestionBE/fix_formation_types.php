<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking current formation types ===\n\n";

$formations = DB::table('formations')->select('id', 'code', 'titre', 'type')->get();

echo "Current data:\n";
foreach ($formations as $formation) {
    echo "ID: {$formation->id} | Code: {$formation->code} | Type: {$formation->type}\n";
}

echo "\n=== Fixing formation types ===\n\n";

// Map incorrect types to correct ones
// Présentiel, En ligne, Hybride should become "Interne" or "Externe"
// Let's set them all to "Interne" by default (you can adjust this logic)

$typesToFix = ['Présentiel', 'Presentiel', 'En ligne', 'Hybride'];

$updated = DB::table('formations')
    ->whereIn('type', $typesToFix)
    ->update(['type' => 'Interne']);

echo "Updated {$updated} formations\n";

// Now check Externe ones - they should remain as is
echo "\n=== Final state ===\n\n";

$formationsAfter = DB::table('formations')->select('id', 'code', 'titre', 'type')->get();

foreach ($formationsAfter as $formation) {
    echo "ID: {$formation->id} | Code: {$formation->code} | Type: {$formation->type}\n";
}

echo "\nDone!\n";
