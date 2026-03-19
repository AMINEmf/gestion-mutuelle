<?php

namespace Database\Seeders;

use App\Models\Poste;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GpPostesSeeder extends Seeder
{
    public function run(): void
    {
        if (Poste::count() > 0) {
            return;
        }

        $uniteIds = DB::table('gp_unites')->pluck('id')->values()->all();
        if (empty($uniteIds)) {
            return;
        }

        $pickUniteId = function (int $index) use ($uniteIds): int {
            return $uniteIds[$index % count($uniteIds)];
        };

        $postes = [
            [
                'nom' => 'Developpeur Junior',
                'unite_id' => $pickUniteId(0),
                'statut' => 'actif',
                'niveau' => 'Junior',
                'description' => 'Poste de developpement applicatif niveau junior.',
            ],
            [
                'nom' => 'Developpeur Senior',
                'unite_id' => $pickUniteId(1),
                'statut' => 'actif',
                'niveau' => 'Senior',
                'description' => 'Poste de developpement applicatif niveau senior.',
            ],
            [
                'nom' => 'Data Analyst',
                'unite_id' => $pickUniteId(2),
                'statut' => 'vacant',
                'niveau' => 'Intermediaire',
                'description' => 'Poste d\'analyse et de reporting data.',
            ],
            [
                'nom' => 'HRBP',
                'unite_id' => $pickUniteId(3),
                'statut' => 'actif',
                'niveau' => 'Senior',
                'description' => 'Poste RH pour l\'accompagnement des managers.',
            ],
            [
                'nom' => 'Controleur',
                'unite_id' => $pickUniteId(4),
                'statut' => 'actif',
                'niveau' => 'Confirme',
                'description' => 'Poste de controle et suivi financier.',
            ],
            [
                'nom' => 'Chef de produit',
                'unite_id' => $pickUniteId(5),
                'statut' => 'actif',
                'niveau' => 'Confirme',
                'description' => 'Poste de pilotage produit.',
            ],
        ];

        foreach ($postes as $poste) {
            Poste::updateOrCreate(
                ['nom' => $poste['nom'], 'unite_id' => $poste['unite_id']],
                $poste
            );
        }
    }
}
