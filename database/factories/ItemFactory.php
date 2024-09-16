<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 0, 100),
            'quantity' => fake()->numberBetween(0, 100),
            'type' => fake()->randomElement(['Meal', 'Drink', 'Snack', 'Others']),
            'image_path' => fake()->imageUrl(800, 600, 'animals', true),
            'state' => fake()->randomElement([0, 1])
        ];
    }
}
