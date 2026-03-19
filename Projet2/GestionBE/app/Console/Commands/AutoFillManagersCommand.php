<?php

namespace App\Console\Commands;

use App\Models\Employe;
use App\Services\ManagerAutoAssignService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AutoFillManagersCommand extends Command
{
    protected $signature = 'managers:autofill {--dry-run : Simuler sans écrire} {--force-fill : Forcer un manager même si les règles strictes ne trouvent pas de candidat}';
    protected $description = 'Affecte automatiquement les managers manquants selon la logique RH.';

    public function handle(ManagerAutoAssignService $service): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $forceFill = (bool) $this->option('force-fill');

        $rows = Employe::query()
            ->with(['departements:id', 'poste:id,grade_id,niveau'])
            ->whereNull('manager_id')
            ->orderByDesc('active')
            ->orderBy('id')
            ->get();

        if ($rows->isEmpty()) {
            $this->info('Aucun employé avec manager_id null.');
            return self::SUCCESS;
        }

        $this->info("Employés à traiter : {$rows->count()}");

        $updated = 0;
        $skipped = 0;

        DB::transaction(function () use ($rows, $service, $dryRun, $forceFill, &$updated, &$skipped) {
            foreach ($rows as $employe) {
                $managerId = $service->suggestManagerId($employe);

                if (!$managerId && $forceFill) {
                    $managerId = $service->suggestFallbackManagerId($employe);
                }

                if (!$managerId) {
                    $skipped++;
                    $this->warn("SKIP employe_id={$employe->id} (aucun manager éligible)");
                    continue;
                }

                if ($dryRun) {
                    $this->line("DRY employe_id={$employe->id} -> manager_id={$managerId}");
                    $updated++;
                    continue;
                }

                Employe::where('id', $employe->id)->update(['manager_id' => $managerId]);
                $updated++;
                $this->line("SET employe_id={$employe->id} -> manager_id={$managerId}");
            }
        });

        $this->info("Terminé. Mis à jour: {$updated}, ignorés: {$skipped}");

        return self::SUCCESS;
    }
}
