<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employe;
use App\Models\GpEmployePosteHistorique;

class CarriereSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $employes = Employe::query()
            ->whereNotNull('poste_id')
            ->whereDoesntHave('posteHistoriques')
            ->with(['poste:id,grade_id'])
            ->get();

        if ($employes->isEmpty()) {
            $this->command?->info('CarriereSeeder: no employes to backfill.');
            return;
        }

        foreach ($employes as $employe) {
            if (!$employe->poste_id) {
                continue;
            }

            GpEmployePosteHistorique::create([
                'employe_id' => $employe->id,
                'poste_id' => $employe->poste_id,
                'grade_id' => $employe->poste?->grade_id,
                'date_debut' => $employe->created_at
                    ? $employe->created_at->toDateString()
                    : now()->toDateString(),
                'date_fin' => null,
                'type_evolution' => 'Affectation',
            ]);
        }

        $this->command?->info('CarriereSeeder: backfill completed.');
    }
}
