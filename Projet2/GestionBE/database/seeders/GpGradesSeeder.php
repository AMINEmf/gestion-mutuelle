<?php

namespace Database\Seeders;

use App\Models\GpGrade;
use Illuminate\Database\Seeder;

class GpGradesSeeder extends Seeder
{
    public function run(): void
    {
        $grades = [
            ['code' => 'G1', 'label' => 'Junior', 'description' => 'Debutant/Apprenant'],
            ['code' => 'G2', 'label' => 'Intermediaire', 'description' => 'Autonome'],
            ['code' => 'G3', 'label' => 'Confirme', 'description' => 'Expertise metier'],
            ['code' => 'G4', 'label' => 'Senior', 'description' => 'Leadership technique'],
            ['code' => 'G5', 'label' => 'Manager', 'description' => 'Pilotage & strategie'],
        ];

        GpGrade::upsert($grades, ['code'], ['label', 'description']);
    }
}
