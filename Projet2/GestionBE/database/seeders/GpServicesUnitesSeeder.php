<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GpServicesUnitesSeeder extends Seeder
{
    /**
     * Seed minimal services and unites for Postes & Grades module.
     */
    public function run(): void
    {
        // Vérifier si des départements existent (dépendance pour services)
        $departementIds = DB::table('departements')->pluck('id')->values()->all();
        
        // Si pas de départements, créer un département minimal
        if (empty($departementIds)) {
            $deptId = DB::table('departements')->insertGetId([
                'nom' => 'Direction Générale',
                'code' => 'DG',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $departementIds = [$deptId];
        }

        $firstDeptId = $departementIds[0];

        // Créer des services minimaux si inexistants
        $serviceCount = DB::table('gp_services')->count();
        if ($serviceCount === 0) {
            $services = [
                ['nom' => 'Service IT', 'departement_id' => $firstDeptId],
                ['nom' => 'Service RH', 'departement_id' => $firstDeptId],
                ['nom' => 'Service Finance', 'departement_id' => $firstDeptId],
            ];

            foreach ($services as $service) {
                DB::table('gp_services')->insert(array_merge($service, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }

        // Récupérer les IDs des services
        $serviceIds = DB::table('gp_services')->pluck('id')->values()->all();
        if (empty($serviceIds)) {
            return;
        }

        // Créer des unités minimales si inexistantes
        $uniteCount = DB::table('gp_unites')->count();
        if ($uniteCount === 0) {
            $unites = [
                ['nom' => 'Unité Développement', 'service_id' => $serviceIds[0]],
                ['nom' => 'Unité Data', 'service_id' => $serviceIds[0]],
                ['nom' => 'Unité Gestion du Personnel', 'service_id' => $serviceIds[1] ?? $serviceIds[0]],
                ['nom' => 'Unité Comptabilité', 'service_id' => $serviceIds[2] ?? $serviceIds[0]],
            ];

            foreach ($unites as $unite) {
                DB::table('gp_unites')->insert(array_merge($unite, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }

        $this->command->info('✓ Services et Unités créés avec succès');
    }
}
