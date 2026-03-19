<?php

namespace Database\Seeders;

use App\Models\DemandeFormation;
use App\Models\Employe;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemandesFormationDemoSeeder extends Seeder
{
    public function run(): void
    {
        $created = 0;
        $updated = 0;

        $employes = Employe::query()
            ->with(['departements:id,nom', 'manager:id,nom,prenom'])
            ->where('active', 1)
            ->orderBy('id')
            ->take(3)
            ->get();

        if ($employes->count() < 1) {
            $this->command?->warn('DemandesFormationDemoSeeder: aucun employé actif trouvé.');
            return;
        }

        $formations = Formation::query()
            ->whereNotNull('titre')
            ->orderBy('id')
            ->pluck('titre')
            ->map(fn ($titre) => trim((string) $titre))
            ->filter()
            ->values();

        if ($formations->count() < 1) {
            $this->command?->warn('DemandesFormationDemoSeeder: aucune formation existante trouvée dans la table formations.');
            return;
        }

        $createdBy = User::query()->orderBy('id')->value('id');

        $templates = [
            [
                'objectif' => 'Renforcer la capacité de pilotage de projets transverses et améliorer la coordination inter-équipes.',
                'lien_poste' => 'Directement lié aux missions actuelles de coordination opérationnelle.',
                'urgence' => 'Moyenne',
                'cout_estime' => 4200.00,
                'source_demande' => 'Manager',
                'commentaire_rh' => 'Demande pertinente, à valider selon budget trimestre.',
                'organisation_formation' => null,
                'inscription' => null,
                'suivi_participation' => null,
                'resultat' => null,
                'statut' => 'En étude',
            ],
            [
                'objectif' => 'Améliorer l’automatisation des tableaux de bord et la qualité de reporting.',
                'lien_poste' => 'Nécessaire pour le traitement de données RH et reporting mensuel.',
                'urgence' => 'Haute',
                'cout_estime' => 2500.00,
                'source_demande' => 'Employé',
                'commentaire_rh' => 'Validation accordée, session planifiée le mois prochain.',
                'organisation_formation' => 'Cabinet externe certifié',
                'inscription' => 'Inscription confirmée',
                'suivi_participation' => 'Présence prévue à 100%',
                'resultat' => null,
                'statut' => 'Planifiée',
            ],
            [
                'objectif' => 'Mettre à jour les connaissances réglementaires et réduire les risques opérationnels.',
                'lien_poste' => 'Obligatoire pour le poste occupé en environnement industriel.',
                'urgence' => 'Haute',
                'cout_estime' => 1800.00,
                'source_demande' => 'Obligation légale',
                'commentaire_rh' => 'Formation réalisée, évaluation finale satisfaisante.',
                'organisation_formation' => 'Session interne HSE',
                'inscription' => 'Inscription validée',
                'suivi_participation' => 'Participation complète',
                'resultat' => 'Attestation obtenue',
                'statut' => 'Réalisée',
            ],
        ];

        foreach ($employes as $index => $employe) {
            $template = $templates[$index % count($templates)];
            $formationSouhaitee = $formations[$index % $formations->count()];
            $departementId = $employe->departement_id ?? optional($employe->departements->first())->id;

            $demande = DemandeFormation::updateOrCreate(
                [
                    'employe_id' => $employe->id,
                    'source_demande' => $template['source_demande'],
                ],
                [
                    'formation_souhaitee' => $formationSouhaitee,
                    'manager_id' => $employe->manager_id,
                    'departement_id' => $departementId,
                    'objectif' => $template['objectif'],
                    'lien_poste' => $template['lien_poste'],
                    'urgence' => $template['urgence'],
                    'cout_estime' => $template['cout_estime'],
                    'commentaire_rh' => $template['commentaire_rh'],
                    'organisation_formation' => $template['organisation_formation'],
                    'inscription' => $template['inscription'],
                    'suivi_participation' => $template['suivi_participation'],
                    'resultat' => $template['resultat'],
                    'statut' => $template['statut'],
                    'created_by' => $createdBy,
                ]
            );

            if ($demande->wasRecentlyCreated) {
                $created++;
            } else {
                $updated++;
            }
        }

        $total = DemandeFormation::count();
        $this->command?->info("DemandesFormationDemoSeeder: import terminé (créées={$created}, mises_à_jour={$updated}, total_table={$total}).");
    }
}
