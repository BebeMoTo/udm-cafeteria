<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        
        User::factory()->create([
            'name' => 'Jay-R Buitre',
            'email' => 'jayrbuitre0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "Admin",
            'balance' => 75,
            'expense' => 20.50,
            'sex' => 'Male', // Add this line
        ]);
        User::factory()->create([
            'name' => 'Oat Buitre',
            'email' => 'oatbuitre0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "User",
            'balance' => 50,
            'expense' => 0,
            'department' => 'CET', // Add this line
            'sex' => 'Male', // Add this line
        ]);
        User::factory()->create([
            'name' => 'Josephine Culdora',
            'email' => 'josephineculdora0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "User",
            'balance' => 80.25,
            'expense' => 20.50,
            'department' => 'CET', // Add this line
            'sex' => 'Female', // Add this line
        ]);
        User::factory()->create([
            'name' => 'John Rey',
            'email' => 'johnreybuitre0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "Seller",
            'balance' => null,
            'expense' => null,
            'sex' => 'Male', // Add this line
            'store_id' => 1,
        ]);



        User::factory()->create([
            'name' => 'MamaMia',
            'email' => 'mamamiat4re0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "User",
            'balance' => 75,
            'expense' => 20.50,
            'department' => 'CAS', // Add this line
            'sex' => 'Male', // Add this line
        ]);
        User::factory()->create([
            'name' => 'Sheeshable Buitre',
            'email' => 'sheeshe0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "User",
            'balance' => 50,
            'expense' => 0,
            'department' => 'CAS', // Add this line
            'sex' => 'Male', // Add this line
        ]);
        User::factory()->create([
            'name' => 'Tomkros',
            'email' => 'tomkros@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "User",
            'balance' => 80.25,
            'expense' => 20.50,
            'department' => 'CE', // Add this line
            'sex' => 'Female', // Add this line
        ]);
        User::factory()->create([
            'name' => 'Washinmi',
            'email' => 'fsrkogjeybuitre0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "Seller",
            'balance' => null,
            'expense' => null,
            'sex' => 'Male', // Add this line
            'store_id' => 2,
        ]);
        User::factory()->create([
            'name' => 'So High',
            'email' => 'ineedyoumostofall@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "Admin",
            'balance' => 75,
            'expense' => 20.50,
            'sex' => 'Male', // Add this line
        ]);
        User::factory()->create([
            'name' => 'Vis djskf',
            'email' => 'wanda@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "User",
            'balance' => 50,
            'expense' => 0,
            'department' => 'CE', // Add this line
            'sex' => 'Male', // Add this line
        ]);
        User::factory()->create([
            'name' => 'Stephen San',
            'email' => 'shancheese@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "User",
            'balance' => 80.25,
            'expense' => 20.50,
            'department' => 'CAS', // Add this line
            'sex' => 'Male', // Add this line
        ]);
        User::factory()->create([
            'name' => 'Jopay',
            'email' => 'jopay@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "Seller",
            'balance' => null,
            'expense' => null,
            'sex' => 'Female', // Add this line
            'store_id' => 3,
        ]);
        

        Store::factory()->count(10)->hasItems(15)->create();

        //$this->call(CartSeeder::class);
    }
}
