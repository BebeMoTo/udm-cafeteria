<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Store>
 */
class StoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'stall_no' => fake()->unique()->numberBetween(1 - 100),
            'name' => fake()->name(),
            'balance' => fake()->randomFloat(2, 100, 1000),
            'description' => fake()->sentence(),
            'state' => fake()->randomElement([0, 1]),
            'additional_fee' => fake()->randomFloat(2, 0, 5),
        ];
    }
}
