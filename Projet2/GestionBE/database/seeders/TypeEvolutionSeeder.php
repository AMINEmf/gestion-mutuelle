<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TypeEvolutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $types = [
            ['name' => 'Promotion', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Mutation', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Mobilité', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Recrutement externe', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Affectation', 'created_at' => $now, 'updated_at' => $now],
        ];

        // Delete existing types to avoid duplicates
        DB::table('types_evolution')->truncate();

        // Insert the new types
        DB::table('types_evolution')->insert($types);

        $this->command->info('Types d\'évolution insérés avec succès!');
    }
}
