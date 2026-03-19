<?php

namespace Database\Seeders;

use App\Models\DemandeMobilite;
use App\Models\Employe;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemandesMobiliteDemoSeeder extends Seeder
{
    public function run(): void
    {
        $created = 0;
        $updated = 0;

        $employes = Employe::query()
            ->with(['poste:id,nom', 'departements:id,nom'])
            ->where('active', 1)
            ->orderBy('id')
            ->take(3)
            ->get();

        if ($employes->count() < 1) {
            $this->command?->warn('DemandesMobiliteDemoSeeder: aucun employé actif trouvé.');
            return;
        }

        $createdBy = User::query()->orderBy('id')->value('id');

        $templates = [
            [
                'poste_souhaite' => 'Chef d\'équipe Production',
                'type_mobilite' => 'Promotion',
                'source_demande' => 'Entretien avec l’employé',
                'motivation' => 'Souhaite évoluer vers un poste d’encadrement après de bons résultats et une ancienneté confirmée.',
                'disponibilite' => now()->addWeeks(4)->toDateString(),
                'avis_manager' => 'Avis favorable, profil autonome et bonne capacité de coordination.',
                'compatibilite_profil_poste' => 'Élevée',
                'besoin_formation' => false,
                'details_formation' => null,
                'disponibilite_poste' => 'En attente',
                'impact_organisationnel' => 'Renforcement du pilotage de l’équipe sur le quart matin.',
                'commentaire_rh' => 'Dossier complet, en cours de validation des besoins opérationnels.',
                'statut' => 'En étude',
                'rh_responsable' => 'Service RH',
            ],
            [
                'poste_souhaite' => 'Chargé RH',
                'type_mobilite' => 'Mutation interne',
                'source_demande' => 'Demande par mail',
                'motivation' => 'Volonté de reconversion vers les activités RH après formation interne en administration du personnel.',
                'disponibilite' => now()->addWeeks(6)->toDateString(),
                'avis_manager' => 'Avis positif sous réserve d’un plan de passation sur le poste actuel.',
                'compatibilite_profil_poste' => 'Moyenne à élevée',
                'besoin_formation' => true,
                'details_formation' => 'Formation courte sur SIRH et gestion administrative du personnel.',
                'disponibilite_poste' => 'Oui',
                'impact_organisationnel' => 'Nécessite un remplacement temporaire sur l’équipe actuelle.',
                'commentaire_rh' => 'Plan de montée en compétence à formaliser avant validation finale.',
                'statut' => 'Avis manager demandé',
                'rh_responsable' => 'Service RH',
            ],
            [
                'poste_souhaite' => 'Coordinateur Logistique',
                'type_mobilite' => 'Changement de département',
                'source_demande' => 'Plan de carrière',
                'motivation' => 'Projet de mobilité identifié lors des entretiens annuels pour élargir le périmètre métier.',
                'disponibilite' => now()->addWeeks(8)->toDateString(),
                'avis_manager' => 'Recommandé dans le cadre du développement de carrière.',
                'compatibilite_profil_poste' => 'Bonne',
                'besoin_formation' => true,
                'details_formation' => 'Formation sur les processus logistiques internes et outils de suivi.',
                'disponibilite_poste' => 'En attente',
                'impact_organisationnel' => 'Rééquilibrage des effectifs entre départements à anticiper.',
                'commentaire_rh' => 'Passage en comité de validation direction prévu.',
                'statut' => 'En validation direction',
                'rh_responsable' => 'Service RH',
            ],
        ];

        foreach ($employes as $index => $employe) {
            $template = $templates[$index % count($templates)];
            $posteActuel = $employe->poste?->nom;
            $departementActuel = optional($employe->departements->first())->nom;

            $demande = DemandeMobilite::updateOrCreate(
                [
                    'employe_id' => $employe->id,
                    'poste_souhaite' => $template['poste_souhaite'],
                    'type_mobilite' => $template['type_mobilite'],
                ],
                [
                    'poste_actuel' => $posteActuel,
                    'departement_actuel' => $departementActuel,
                    'source_demande' => $template['source_demande'],
                    'motivation' => $template['motivation'],
                    'disponibilite' => $template['disponibilite'],
                    'avis_manager' => $template['avis_manager'],
                    'compatibilite_profil_poste' => $template['compatibilite_profil_poste'],
                    'besoin_formation' => $template['besoin_formation'],
                    'details_formation' => $template['details_formation'],
                    'disponibilite_poste' => $template['disponibilite_poste'],
                    'impact_organisationnel' => $template['impact_organisationnel'],
                    'commentaire_rh' => $template['commentaire_rh'],
                    'statut' => $template['statut'],
                    'created_by' => $createdBy,
                    'rh_responsable' => $template['rh_responsable'],
                ]
            );

            if ($demande->wasRecentlyCreated) {
                $created++;
            } else {
                $updated++;
            }
        }

        $total = DemandeMobilite::count();
        $this->command?->info("DemandesMobiliteDemoSeeder: import terminé (créées={$created}, mises_à_jour={$updated}, total_table={$total}).");
    }
}
