<?php

namespace Database\Seeders;

use App\Models\GpEmployePosteHistorique;
use App\Models\Poste;
use Illuminate\Database\Seeder;

class CarriereEvolutionScenariosSeeder extends Seeder
{
    public function run(): void
    {
        $created = 0;
        $updated = 0;

        $activeHistoriques = GpEmployePosteHistorique::query()
            ->with(['grade:id,code,ordre'])
            ->where('statut', 'Validé')
            ->whereNull('date_fin')
            ->orderBy('id')
            ->get();

        if ($activeHistoriques->isEmpty()) {
            $this->command?->warn('CarriereEvolutionScenariosSeeder: aucun historique actif validé trouvé.');
            return;
        }

        $postesByGradeCode = Poste::query()
            ->with('grade:id,code')
            ->get()
            ->filter(fn ($poste) => !empty($poste->grade?->code))
            ->groupBy(fn ($poste) => strtoupper(trim((string) $poste->grade->code)));

        $scenarios = [
            [
                'name' => 'JR_to_SR',
                'source_grade' => 'JR',
                'target_grade' => 'SR',
                'days_ago' => 3,
            ],
            [
                'name' => 'SR_to_CF',
                'source_grade' => 'SR',
                'target_grade' => 'CF',
                'days_ago' => 2,
            ],
            [
                'name' => 'CF_to_CF',
                'source_grade' => 'CF',
                'target_grade' => 'CF',
                'days_ago' => 1,
            ],
            [
                'name' => 'EXP_to_MGR',
                'source_grade' => 'EXP',
                'target_grade' => 'MGR',
                'days_ago' => 0,
            ],
        ];

        foreach ($scenarios as $scenario) {
            $sourceCode = strtoupper($scenario['source_grade']);
            $targetCode = strtoupper($scenario['target_grade']);

            $sourceHistorique = $activeHistoriques
                ->first(fn ($historique) => strtoupper((string) ($historique->grade?->code ?? '')) === $sourceCode);

            if (!$sourceHistorique) {
                $this->command?->warn("CarriereEvolutionScenariosSeeder: scénario {$scenario['name']} ignoré (aucun employé actif avec grade {$sourceCode}).");
                continue;
            }

            $targetPoste = $postesByGradeCode->get($targetCode)?->first();
            if (!$targetPoste) {
                $this->command?->warn("CarriereEvolutionScenariosSeeder: scénario {$scenario['name']} ignoré (aucun poste avec grade {$targetCode}).");
                continue;
            }

            $date = now()->subDays((int) $scenario['days_ago'])->toDateString();
            $typeEvolution = GpEmployePosteHistorique::calculateTypeEvolution(
                $sourceHistorique->employe_id,
                $targetPoste->id,
                $targetPoste->grade_id,
                null
            );

            $historique = GpEmployePosteHistorique::updateOrCreate(
                [
                    'employe_id' => $sourceHistorique->employe_id,
                    'poste_id' => $targetPoste->id,
                    'grade_id' => $targetPoste->grade_id,
                    'date_debut' => $date,
                    'statut' => 'Validé',
                ],
                [
                    'date_fin' => $date,
                    'type_evolution' => $typeEvolution,
                ]
            );

            if ($historique->wasRecentlyCreated) {
                $created++;
            } else {
                $updated++;
            }
        }

        $this->command?->info("CarriereEvolutionScenariosSeeder: import terminé (créées={$created}, mises_à_jour={$updated}).");
    }
}
