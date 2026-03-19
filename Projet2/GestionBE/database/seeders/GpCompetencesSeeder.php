<?php

namespace Database\Seeders;

use App\Models\GpCompetence;
use Illuminate\Database\Seeder;

class GpCompetencesSeeder extends Seeder
{
    public function run(): void
    {
        $competences = [
            ['nom' => 'React', 'categorie' => 'Frontend', 'description' => 'Bibliotheque UI'],
            ['nom' => 'TypeScript', 'categorie' => 'Frontend', 'description' => 'Typage JavaScript'],
            ['nom' => 'UI/UX', 'categorie' => 'Frontend', 'description' => 'Design interface'],
            ['nom' => 'HTML/CSS', 'categorie' => 'Frontend', 'description' => 'Integration web'],
            ['nom' => 'Laravel', 'categorie' => 'Backend', 'description' => 'Framework PHP'],
            ['nom' => 'API REST', 'categorie' => 'Backend', 'description' => 'Conception d\'API'],
            ['nom' => 'Node.js', 'categorie' => 'Backend', 'description' => 'Runtime JavaScript'],
            ['nom' => 'Architecture', 'categorie' => 'Systeme', 'description' => 'Conception d\'architecture'],
            ['nom' => 'SQL', 'categorie' => 'Data', 'description' => 'Requetes et modelisation'],
            ['nom' => 'Reporting', 'categorie' => 'Data', 'description' => 'Analyse et rapports'],
            ['nom' => 'Power BI', 'categorie' => 'Data', 'description' => 'Visualisation donnees'],
            ['nom' => 'Git', 'categorie' => 'DevOps', 'description' => 'Versioning'],
            ['nom' => 'CI/CD', 'categorie' => 'DevOps', 'description' => 'Automatisation'],
            ['nom' => 'Communication', 'categorie' => 'Soft Skills', 'description' => 'Communication interne/externe'],
            ['nom' => 'Leadership', 'categorie' => 'Soft Skills', 'description' => 'Management et influence'],
            ['nom' => 'Gestion de projet', 'categorie' => 'Soft Skills', 'description' => 'Organisation et suivi'],
            ['nom' => 'Negociation', 'categorie' => 'Soft Skills', 'description' => 'Negociation et persuasion'],
            ['nom' => 'Excel', 'categorie' => 'Data', 'description' => 'Analyse et tableaux de bord'],
        ];

        GpCompetence::upsert($competences, ['nom', 'categorie'], ['description']);
    }
}
