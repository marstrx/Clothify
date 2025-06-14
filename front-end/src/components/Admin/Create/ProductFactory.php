<?php

namespace Database\Factories;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories =["men","women","kids"];
        $oldPrice =$this->faker->randomFloat(2,100,500);
        $newPrice =$oldPrice-$this->faker->randomFloat(2,10,50);
        return [
            "name"=>ucfirst($this->faker->word),
            "category"=>$this->faker->randomElement($categories),
            "description"=>$this->faker->sentence(10),
            "old_price"=>$oldPrice,
            "new_price"=>$newPrice,
            "image"=>"https://picsum.photos/200/300?random=".rand(1,100),
        ];
    }
}
