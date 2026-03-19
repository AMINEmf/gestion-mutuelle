<?php
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Employes table indexes ===\n";
$indexes = DB::select("SHOW INDEX FROM employes");
foreach ($indexes as $idx) {
    echo "  {$idx->Key_name}: {$idx->Column_name}\n";
}

echo "\n=== Check Employe model accessors ===\n";
$employeClass = new ReflectionClass(\App\Models\Employe::class);
$methods = $employeClass->getMethods(ReflectionMethod::IS_PUBLIC);
$accessors = array_filter($methods, function($m) {
    return str_starts_with($m->name, 'get') && str_ends_with($m->name, 'Attribute');
});
foreach ($accessors as $acc) {
    echo "  {$acc->name}\n";
}

echo "\n=== Optimized query test ===\n";
DB::enableQueryLog();
$start = microtime(true);
$employe = \App\Models\Employe::select('id', 'nom', 'prenom', 'poste_id')->find(1);
$competences = DB::table('gp_employe_competence')
    ->join('gp_competences', 'gp_competences.id', '=', 'gp_employe_competence.competence_id')
    ->where('gp_employe_competence.employe_id', 1)
    ->select('gp_competences.id', 'gp_competences.nom', 'gp_competences.categorie', 
             'gp_competences.description', 'gp_employe_competence.niveau', 
             'gp_employe_competence.niveau_acquis', 'gp_employe_competence.date_acquisition')
    ->get();
$end = microtime(true);

echo "Optimized Query Time: " . round(($end - $start) * 1000, 2) . "ms\n";
echo "Competences found: " . $competences->count() . "\n";

foreach (DB::getQueryLog() as $query) {
    echo "  Time: " . round($query['time'], 2) . "ms\n";
}
