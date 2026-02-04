<?php

namespace Database\Seeders;

use App\Models\Employe;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MutuelleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1) Insérer les mutuelles
        $mutuelles = [
            ['nom' => 'CNSS - Caisse Nationale de Sécurité Sociale', 'active' => true],
            ['nom' => 'RAMED - Régime d\'Assistance Médicale', 'active' => true],
            ['nom' => 'AMO - Assurance Maladie Obligatoire', 'active' => true],
            ['nom' => 'MGPAP - Mutuelle Générale du Personnel des Administrations Publiques', 'active' => true],
            ['nom' => 'Mutuelle Atlas', 'active' => true],
            ['nom' => 'Ancienne Mutuelle', 'active' => false],
        ];

        foreach ($mutuelles as $mutuelle) {
            DB::table('mutuelles')->insert(array_merge($mutuelle, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        // 2) Insérer les régimes pour chaque mutuelle
        $regimes = [
            // CNSS
            [
                'mutuelle_id' => 1, // CNSS
                'libelle' => 'Régime Général CNSS',
                'taux_couverture' => 70,
                'cotisation_mensuelle' => 450.00,
                'part_employeur_pct' => 70.00,
                'part_employe_pct' => 30.00,
                'active' => true
            ],
            [
                'mutuelle_id' => 1, // CNSS
                'libelle' => 'Régime Cadres CNSS',
                'taux_couverture' => 80,
                'cotisation_mensuelle' => 650.00,
                'part_employeur_pct' => 75.00,
                'part_employe_pct' => 25.00,
                'active' => true
            ],
            // RAMED
            [
                'mutuelle_id' => 2, // RAMED
                'libelle' => 'RAMED Basic',
                'taux_couverture' => 90,
                'cotisation_mensuelle' => 0.00,
                'part_employeur_pct' => 100.00,
                'part_employe_pct' => 0.00,
                'active' => true
            ],
            // AMO
            [
                'mutuelle_id' => 3, // AMO
                'libelle' => 'AMO Standard',
                'taux_couverture' => 70,
                'cotisation_mensuelle' => 380.00,
                'part_employeur_pct' => 65.00,
                'part_employe_pct' => 35.00,
                'active' => true
            ],
            [
                'mutuelle_id' => 3, // AMO
                'libelle' => 'AMO Plus',
                'taux_couverture' => 85,
                'cotisation_mensuelle' => 580.00,
                'part_employeur_pct' => 70.00,
                'part_employe_pct' => 30.00,
                'active' => true
            ],
            // MGPAP
            [
                'mutuelle_id' => 4, // MGPAP
                'libelle' => 'Régime Fonctionnaires',
                'taux_couverture' => 90,
                'cotisation_mensuelle' => 520.00,
                'part_employeur_pct' => 80.00,
                'part_employe_pct' => 20.00,
                'active' => true
            ],
            // Mutuelle Atlas
            [
                'mutuelle_id' => 5, // Mutuelle Atlas
                'libelle' => 'Atlas Essentiel',
                'taux_couverture' => 75,
                'cotisation_mensuelle' => 420.00,
                'part_employeur_pct' => 60.00,
                'part_employe_pct' => 40.00,
                'active' => true
            ],
            [
                'mutuelle_id' => 5, // Mutuelle Atlas
                'libelle' => 'Atlas Premium',
                'taux_couverture' => 95,
                'cotisation_mensuelle' => 750.00,
                'part_employeur_pct' => 65.00,
                'part_employe_pct' => 35.00,
                'active' => true
            ],
        ];

        foreach ($regimes as $regime) {
            DB::table('regimes_mutuelle')->insert(array_merge($regime, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        // 3) Créer quelques affiliations de test (si des employés existent)
        $employes = DB::table('employes')->where('active', true)->limit(10)->get();
        
        if ($employes->count() > 0) {
            $affiliations = [];
            $dateAdhesion = now()->subMonths(6);
            
            foreach ($employes as $index => $employe) {
                // Varier les affiliations
                $regimeId = ($index % 8) + 1; // Répartir sur les 8 régimes
                $ayantDroit = $index % 3 === 0; // 1 employé sur 3 avec ayant droit
                
                $affiliations[] = [
                    'employe_id' => $employe->id,
                    'mutuelle_id' => ceil($regimeId / 2), // Déduire la mutuelle du régime
                    'regime_mutuelle_id' => $regimeId,
                    'date_adhesion' => $dateAdhesion->addDays($index * 7), // Espacement d'une semaine
                    'date_resiliation' => null,
                    'ayant_droit' => $ayantDroit,
                    'statut' => 'ACTIVE',
                    'commentaire' => $ayantDroit ? 'Affiliation avec ayant droit (conjoint + enfants)' : null,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
            
            DB::table('affiliations_mutuelle')->insert($affiliations);
        }

        $this->command->info('Données de test créées :');
        $this->command->info('- ' . count($mutuelles) . ' mutuelles');
        $this->command->info('- ' . count($regimes) . ' régimes');
        $this->command->info('- ' . count($affiliations ?? []) . ' affiliations de test');
    }
}
