<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;
// use RolesAndPermissionsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        // $this->call([FullDataSeeder::class, ]);
        $this->call([RolesAndPermissionsSeeder::class]);

        $this->call([
            DeclarationsCnssSeeder::class,
            DetailsDeclarationCnssSeeder::class,
        ]);

        $this->call([
            GpGradesSeeder::class,
            GpCompetencesSeeder::class,
            GpServicesUnitesSeeder::class,  // Créer services/unités avant les postes
            GpPostesSeeder::class,
            GpPosteCompetenceSeeder::class,
            CarriereSeeder::class,
            CarriereEvolutionScenariosSeeder::class,
            DemandesMobiliteDemoSeeder::class,
            DemandesFormationDemoSeeder::class,
        ]);
       
    

    }
}

