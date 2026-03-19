<?php

namespace App\Console\Commands;

use App\Models\Employe;
use App\Models\GpEmployePosteHistorique;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class BackfillEmployePosteHistorique extends Command
{
    protected $signature = 'carrieres:backfill-historiques {--dry-run : Show what would be inserted without writing}';
    protected $description = 'Create initial historique rows for employees with poste_id but no historique yet';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $employes = Employe::query()
            ->whereNotNull('poste_id')
            ->whereDoesntHave('posteHistoriques')
            ->with(['poste:id,grade_id'])
            ->get();

        if ($employes->isEmpty()) {
            $this->info('No employes found without historique.');
            return self::SUCCESS;
        }

        $this->info("Found {$employes->count()} employes to backfill.");

        if ($dryRun) {
            foreach ($employes as $employe) {
                $this->line("DRY RUN -> employe_id={$employe->id}, poste_id={$employe->poste_id}");
            }
            return self::SUCCESS;
        }

        DB::transaction(function () use ($employes) {
            foreach ($employes as $employe) {
                // Re-check inside transaction to avoid race conditions
                $exists = GpEmployePosteHistorique::where('employe_id', $employe->id)->exists();
                if ($exists || !$employe->poste_id) {
                    continue;
                }

                $gradeId = $employe->poste?->grade_id;
                $dateDebut = $employe->created_at
                    ? $employe->created_at->toDateString()
                    : now()->toDateString();

                GpEmployePosteHistorique::create([
                    'employe_id' => $employe->id,
                    'poste_id' => $employe->poste_id,
                    'grade_id' => $gradeId,
                    'date_debut' => $dateDebut,
                    'date_fin' => null,
                    'type_evolution' => 'Affectation',
                ]);
            }
        });

        $this->info('Backfill complete.');
        return self::SUCCESS;
    }
}
