<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MutuelleTypesSeeder extends Seeder
{
    public function run(): void
    {
        // --- Types d'opérations ---
        $operationTypes = [
            'Dépôt Dossier',
            'Remboursement',
            'Prise en Charge',
            'Réclamation',
            'Attestation',
            'Régularisation',
            'Autre',
        ];

        foreach ($operationTypes as $label) {
            $exists = DB::table('type_operations')->where('label', $label)->exists();
            if (!$exists) {
                DB::table('type_operations')->insert([
                    'label'      => $label,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // --- Types de documents ---
        $documentTypes = [
            'Facture',
            'Ordonnance',
            'Feuille de soins',
            'Bulletin d\'analyse',
            'Compte rendu médical',
            'Certificat médical',
            'Devis médical',
            'Bon de prise en charge',
            'Attestation d\'assurance',
            'Autre',
        ];

        foreach ($documentTypes as $label) {
            $exists = DB::table('type_documents')->where('label', $label)->exists();
            if (!$exists) {
                DB::table('type_documents')->insert([
                    'label'      => $label,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
