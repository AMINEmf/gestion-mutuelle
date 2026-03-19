<?php

namespace Database\Seeders;

use App\Models\GpCompetence;
use App\Models\GpGrade;
use App\Models\Poste;
use Illuminate\Database\Seeder;

class GpPosteCompetenceSeeder extends Seeder
{
    public function run(): void
    {
        $postes = Poste::all();
        if ($postes->isEmpty()) {
            return;
        }

        $grades = GpGrade::all()->keyBy('code');
        $competences = GpCompetence::all();
        if ($competences->isEmpty()) {
            return;
        }

        $competenceByName = $competences->keyBy(function ($competence) {
            return strtolower($competence->nom);
        });

        $niveauByGrade = [
            'G1' => 'Junior',
            'G2' => 'Intermediaire',
            'G3' => 'Confirme',
            'G4' => 'Senior',
            'G5' => 'Manager',
        ];

        $niveauRequisByGrade = [
            'G1' => 2,
            'G2' => 3,
            'G3' => 4,
            'G4' => 4,
            'G5' => 5,
        ];

        foreach ($postes as $poste) {
            $name = strtolower($poste->nom ?? '');

            $gradeCode = 'G2';
            if (str_contains($name, 'junior')) {
                $gradeCode = 'G1';
            } elseif (str_contains($name, 'senior')) {
                $gradeCode = 'G4';
            } elseif (str_contains($name, 'manager')) {
                $gradeCode = 'G5';
            } elseif (str_contains($name, 'hr') || str_contains($name, 'rh') || str_contains($name, 'hrbp')) {
                $gradeCode = 'G4';
            } elseif (str_contains($name, 'controleur')) {
                $gradeCode = 'G3';
            } elseif (str_contains($name, 'chef de produit') || str_contains($name, 'produit')) {
                $gradeCode = 'G3';
            } elseif (str_contains($name, 'data')) {
                $gradeCode = 'G3';
            }

            $gradeId = $grades[$gradeCode]->id ?? null;
            if (!$poste->grade_id && $gradeId) {
                $poste->grade_id = $gradeId;
            }

            if (!$poste->statut) {
                $poste->statut = str_contains($name, 'data') ? 'vacant' : 'actif';
            }

            if (!$poste->niveau) {
                $poste->niveau = $niveauByGrade[$gradeCode] ?? 'Intermediaire';
            }

            if (!$poste->description) {
                $poste->description = 'Poste: ' . ($poste->nom ?? 'Poste');
            }

            $poste->save();

            $competenceNames = [];
            if (str_contains($name, 'developpeur junior')) {
                $competenceNames = ['React', 'TypeScript', 'API REST', 'SQL', 'Git'];
            } elseif (str_contains($name, 'developpeur senior')) {
                $competenceNames = ['React', 'TypeScript', 'Laravel', 'API REST', 'Node.js', 'Architecture'];
            } elseif (str_contains($name, 'data')) {
                $competenceNames = ['SQL', 'Reporting', 'Power BI', 'Excel'];
            } elseif (str_contains($name, 'hr') || str_contains($name, 'rh') || str_contains($name, 'hrbp')) {
                $competenceNames = ['Communication', 'Leadership', 'Gestion de projet'];
            } elseif (str_contains($name, 'controleur')) {
                $competenceNames = ['Reporting', 'Excel', 'SQL'];
            } elseif (str_contains($name, 'chef de produit') || str_contains($name, 'produit')) {
                $competenceNames = ['UI/UX', 'Communication', 'Gestion de projet', 'Reporting'];
            } else {
                $competenceNames = ['Communication', 'Gestion de projet', 'SQL'];
            }

            $niveauRequis = $niveauRequisByGrade[$gradeCode] ?? 3;
            $syncData = [];

            foreach ($competenceNames as $competenceName) {
                $competence = $competenceByName[strtolower($competenceName)] ?? null;
                if (!$competence) {
                    continue;
                }
                $syncData[$competence->id] = [
                    'niveau_requis' => $niveauRequis,
                    'is_required' => true,
                ];
            }

            if (!empty($syncData)) {
                $poste->competences()->syncWithoutDetaching($syncData);
            }
        }
    }
}
