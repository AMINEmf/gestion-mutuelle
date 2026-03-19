<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FixNullPosteIdSeeder extends Seeder
{
    public function run(): void
    {
        $postes = DB::table('gp_postes')
            ->select('id', 'grade_id')
            ->orderBy('id')
            ->get()
            ->values();

        if ($postes->isEmpty()) {
            $this->command?->warn('Aucun poste disponible dans gp_postes. Aucune mise a jour effectuee.');
            return;
        }

        $employees = DB::table('employes')
            ->select('id', 'poste_id')
            ->whereNull('poste_id')
            ->orderBy('id')
            ->get();

        $updatedCount = 0;
        $historiqueCreated = 0;

        DB::transaction(function () use (
            $employees,
            $postes,
            &$updatedCount,
            &$historiqueCreated
        ) {
            $posteCount = $postes->count();
            $index = 0;

            foreach ($employees as $employe) {
                $poste = $postes[$index % $posteCount];
                $index++;

                DB::table('employes')
                    ->where('id', $employe->id)
                    ->update(['poste_id' => $poste->id]);
                $updatedCount++;

                $hasHistorique = DB::table('gp_employe_poste_historiques')
                    ->where('employe_id', $employe->id)
                    ->exists();

                if (!$hasHistorique) {
                    DB::table('gp_employe_poste_historiques')->insert([
                        'employe_id' => $employe->id,
                        'poste_id' => $poste->id,
                        'grade_id' => $poste->grade_id,
                        'date_debut' => now()->toDateString(),
                        'date_fin' => null,
                        'type_evolution' => 'Affectation',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $historiqueCreated++;
                }
            }
        });

        $this->command?->info("Employes mis a jour (poste_id): {$updatedCount}");
        $this->command?->info("Historiques crees: {$historiqueCreated}");
    }
}
