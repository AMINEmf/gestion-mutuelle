<?php

namespace Database\Seeders;

use App\Models\Mutuelle;
use Illuminate\Database\Seeder;

class MutuelleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mutuelles = [
            [
                'nom' => 'CNSS - Caisse Nationale de Sécurité Sociale',
                'code' => 'CNSS',
                'description' => 'Organisme public de protection sociale au Maroc',
                'adresse' => 'Angle Boulevard Mohammed V et rue Oued Baht Rabat, Maroc',
                'telephone' => '+212 537 68 74 00',
                'email' => 'contact@cnss.ma',
                'site_web' => 'https://www.cnss.ma',
                'actif' => true,
            ],
            [
                'nom' => 'RAMED - Régime d\'Assistance Médicale',
                'code' => 'RAMED',
                'description' => 'Régime d\'assistance médicale aux personnes démunies',
                'adresse' => 'Ministère de la Santé, Rabat',
                'telephone' => '+212 537 76 81 00',
                'email' => 'info@sante.gov.ma',
                'site_web' => 'https://www.sante.gov.ma',
                'actif' => true,
            ],
            [
                'nom' => 'AMO - Assurance Maladie Obligatoire',
                'code' => 'AMO',
                'description' => 'Assurance maladie obligatoire des salariés du secteur privé',
                'adresse' => 'Agence Nationale de l\'Assurance Maladie, Rabat',
                'telephone' => '+212 537 67 50 00',
                'email' => 'contact@anam.ma',
                'site_web' => 'https://www.anam.ma',
                'actif' => true,
            ],
            [
                'nom' => 'CMIM - Caisse Mutuelle Interprofessionnelle Marocaine',
                'code' => 'CMIM',
                'description' => 'Mutuelle complémentaire de santé pour les salariés',
                'adresse' => '123 Rue des Mutuelles, Casablanca',
                'telephone' => '+212 522 30 45 67',
                'email' => 'info@cmim.ma',
                'site_web' => 'https://www.cmim.ma',
                'actif' => true,
            ],
            [
                'nom' => 'MGPAP - Mutuelle Générale du Personnel des Administrations Publiques',
                'code' => 'MGPAP',
                'description' => 'Mutuelle des fonctionnaires et agents publics',
                'adresse' => '789 Avenue Mohammed V, Rabat',
                'telephone' => '+212 537 77 88 99',
                'email' => 'contact@mgpap.ma',
                'site_web' => 'https://www.mgpap.ma',
                'actif' => true,
            ],
            [
                'nom' => 'Mutuelle Atlas',
                'code' => 'ATLAS',
                'description' => 'Mutuelle privée de santé',
                'adresse' => '456 Boulevard Zerktouni, Casablanca',
                'telephone' => '+212 522 25 30 40',
                'email' => 'service@mutuelle-atlas.ma',
                'site_web' => 'https://www.mutuelle-atlas.ma',
                'actif' => true,
            ],
        ];

        foreach ($mutuelles as $mutuelleDonnee) {
            Mutuelle::create($mutuelleDonnee);
        }
    }
}