<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== STRUCTURE gp_postes ===\n";
$columns = DB::select('DESCRIBE gp_postes');
foreach ($columns as $column) {
    echo "{$column->Field}: {$column->Type}\n";
}

echo "\n=== STRUCTURE gp_unites ===\n";
$unitesColumns = DB::select('DESCRIBE gp_unites');
foreach ($unitesColumns as $column) {
    echo "{$column->Field}: {$column->Type}\n";
}
