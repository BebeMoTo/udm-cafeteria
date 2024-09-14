<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Cart;
use App\Models\User;
use App\Models\Item;
use App\Models\Store;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::find(2);  // Find user with ID 2
        $items = Item::inRandomOrder()->take(10)->get();  // Get 10 random items from different stores

        foreach ($items as $item) {
            Cart::create([
                'user_id' => $user->id,
                'item_id' => $item->id,
                'store_id' => $item->store_id,  // Use the store_id associated with the item
                'quantity' => rand(1, 5),  // Random quantity between 1 and 5
                'total_price' => $item->price * rand(1, 5),  // Calculate total price
            ]);
        }
    }
}
