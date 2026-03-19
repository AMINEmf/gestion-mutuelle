<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "=== TEST API: /api/postes?departement_id=1 ===\n";

// Simuler la requête
$request = \Illuminate\Http\Request::create('/api/postes', 'GET', ['departement_id' => 1]);

// Charger le contrôleur
$controller = new \App\Http\Controllers\PosteController();

try {
    $response = $controller->index($request);
    $data = json_decode($response->getContent(), true);
    
    echo "Nombre de postes retournés: " . count($data) . "\n\n";
    
    foreach ($data as $poste) {
        $uniteDeptId = $poste['unite']['departement_id'] ?? 'N/A';
        $uniteName = $poste['unite']['nom'] ?? 'N/A';
        echo "- {$poste['nom']}\n";
        echo "  Unite: {$uniteName} (dept_id: {$uniteDeptId})\n";
        echo "  Grade: " . ($poste['grade']['code'] ?? 'N/A') . "\n\n";
    }
    
    echo "\n=== TEST: Tous les postes (sans filtre) ===\n";
    $requestAll = \Illuminate\Http\Request::create('/api/postes', 'GET', []);
    $responseAll = $controller->index($requestAll);
    $dataAll = json_decode($responseAll->getContent(), true);
    echo "Total postes: " . count($dataAll) . "\n";
    
} catch (\Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
