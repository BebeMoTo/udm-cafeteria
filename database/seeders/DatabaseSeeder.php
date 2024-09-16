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
            'expense' => 20.50
        ]);
        User::factory()->create([
            'name' => 'Oat Buitre',
            'email' => 'oatbuitre0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "User",
            'balance' => 50,
            'expense' => 0
        ]);
        User::factory()->create([
            'name' => 'Josephine Culdora',
            'email' => 'josephineculdora0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "User",
            'balance' => 80.25,
            'expense' => 20.50
        ]);
        User::factory()->create([
            'name' => 'John Rey',
            'email' => 'johnreybuitre0226@gmail.com',
            'password' => bcrypt('lovelyjane0226'),
            'type' => "Seller",
            'balance' => null,
            'expense' => null
        ]);
        

        Store::factory()->count(10)->hasItems(15)->create();

        //$this->call(CartSeeder::class);
    }
}
