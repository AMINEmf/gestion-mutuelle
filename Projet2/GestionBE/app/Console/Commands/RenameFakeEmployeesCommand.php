<?php

namespace App\Console\Commands;

use App\Models\Employe;
use Illuminate\Console\Command;

class RenameFakeEmployeesCommand extends Command
{
    protected $signature = 'employees:rename-fake-it-rh';
    protected $description = 'Replace fake IT/RH employee names with real names';

    public function handle(): int
    {
        $map = [
            2 => ['nom' => 'El Amrani', 'prenom' => 'Youssef'],
            3 => ['nom' => 'Bennani', 'prenom' => 'Salma'],
            4 => ['nom' => 'Alaoui', 'prenom' => 'Karim'],
            5 => ['nom' => 'Tazi', 'prenom' => 'Imane'],
            6 => ['nom' => 'Lahlou', 'prenom' => 'Mehdi'],
            7 => ['nom' => 'Chraibi', 'prenom' => 'Nadia'],
            8 => ['nom' => 'Berrada', 'prenom' => 'Hicham'],
            9 => ['nom' => 'El Idrissi', 'prenom' => 'Sara'],
            10 => ['nom' => 'Ait Lahcen', 'prenom' => 'Othmane'],
            11 => ['nom' => 'Benjelloun', 'prenom' => 'Meryem'],
        ];

        $updated = 0;
        foreach ($map as $id => $data) {
            $affected = Employe::where('id', $id)->update([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
            ]);
            $updated += $affected;
        }

        $this->info("Renommage terminé. Lignes mises à jour: {$updated}");

        return self::SUCCESS;
    }
}
