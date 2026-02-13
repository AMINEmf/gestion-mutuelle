<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class RestoreTestSubDeptSeeder extends Seeder
{
    public function run()
    {
        $info = Departement::where('nom', 'INFO')->first();
        
        if ($info) {
            Departement::firstOrCreate([
                'nom' => 'Test',
                'parent_id' => $info->id
            ]);
        }
    }
}
