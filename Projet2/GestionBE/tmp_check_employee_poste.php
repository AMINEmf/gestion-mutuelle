<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Finding employee by matricule M-UKDTY ===\n\n";

$employee = DB::table('employes')
    ->where('matricule', 'M-UKDTY')
    ->first(['id', 'nom', 'prenom', 'matricule', 'poste_id']);

if ($employee) {
    echo "Employee found:\n";
    echo "  ID: {$employee->id}\n";
    echo "  Nom: {$employee->nom} {$employee->prenom}\n";
    echo "  Matricule: {$employee->matricule}\n";
    echo "  Poste ID: {$employee->poste_id}\n\n";
    
    if ($employee->poste_id) {
        $poste = DB::table('gp_postes')->where('id', $employee->poste_id)->first(['id', 'nom']);
        if ($poste) {
            echo "Poste: {$poste->nom} (ID: {$poste->id})\n\n";
            
            echo "=== Competences requises pour ce poste ===\n\n";
            $competences = DB::table('gp_poste_competence')
                ->join('gp_competences', 'gp_poste_competence.competence_id', '=', 'gp_competences.id')
                ->where('gp_poste_competence.poste_id', $poste->id)
                ->get(['gp_competences.id', 'gp_competences.nom', 'gp_poste_competence.niveau_requis']);
            
            foreach ($competences as $comp) {
                echo "  - {$comp->nom} (ID: {$comp->id}): niveau_requis = {$comp->niveau_requis}\n";
            }
        }
    }
} else {
    echo "Employee not found\n";
}
