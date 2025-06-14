<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        
        $productTemplates = [
            'women' => [
                ['name' => 'Summer Dress', 'price_range' => [49, 99], 'features' => ['Cotton', 'Machine Washable', 'Sizes: XS-XXL']],
                ['name' => 'Casual Blouse', 'price_range' => [29, 59], 'features' => ['Polyester', 'Button Front', 'Sizes: S-XL']],
                ['name' => 'Designer Handbag', 'price_range' => [79, 149], 'features' => ['Synthetic Leather', 'Adjustable Strap', 'Multiple Colors']],
                ['name' => 'Fashion Jeans', 'price_range' => [39, 89], 'features' => ['Denim', 'Stretch Fit', 'Sizes: 24-32']],
                ['name' => 'Elegant Skirt', 'price_range' => [34, 69], 'features' => ['Polyester', 'A-Line', 'Sizes: XS-L']],
                ['name' => 'Winter Coat', 'price_range' => [89, 179], 'features' => ['Wool Blend', 'Warm Lining', 'Sizes: S-XXL']]
            ],
            'men' => [
                ['name' => 'Classic Shirt', 'price_range' => [39, 79], 'features' => ['Cotton', 'Button Down', 'Sizes: S-XXL']],
                ['name' => 'Denim Jacket', 'price_range' => [69, 129], 'features' => ['Denim', 'Button Front', 'Sizes: S-XXL']],
                ['name' => 'Casual Sneakers', 'price_range' => [49, 99], 'features' => ['Canvas', 'Rubber Sole', 'Sizes: 7-12']],
                ['name' => 'Formal Pants', 'price_range' => [59, 119], 'features' => ['Wool Blend', 'Flat Front', 'Sizes: 28-38']],
                ['name' => 'Leather Belt', 'price_range' => [29, 59], 'features' => ['Genuine Leather', 'Adjustable', 'Sizes: 32-42']],
                ['name' => 'Winter Sweater', 'price_range' => [49, 89], 'features' => ['Wool Blend', 'Ribbed Cuffs', 'Sizes: S-XXL']]
            ],
            'kids' => [
                ['name' => 'Cartoon T-Shirt', 'price_range' => [19, 39], 'features' => ['Cotton', 'Fun Print', 'Sizes: 3-12']],
                ['name' => 'Denim Overalls', 'price_range' => [29, 59], 'features' => ['Denim', 'Adjustable Straps', 'Sizes: 2-8']],
                ['name' => 'Kids Backpack', 'price_range' => [24, 49], 'features' => ['Polyester', 'Multiple Pockets', 'Adjustable Straps']],
                ['name' => 'Hooded Sweatshirt', 'price_range' => [29, 49], 'features' => ['Cotton Blend', 'Kangaroo Pocket', 'Sizes: 3-14']],
                ['name' => 'School Shoes', 'price_range' => [34, 69], 'features' => ['Synthetic', 'Velcro Closure', 'Sizes: 1-5']],
                ['name' => 'Winter Jacket', 'price_range' => [39, 79], 'features' => ['Polyester', 'Warm Lining', 'Sizes: 3-14']]
            ]
        ];

        foreach ($productTemplates as $category => $templates) {
            foreach ($templates as $template) {
                for ($i = 0; $i < 3; $i++) {
                    $oldPrice = $faker->numberBetween($template['price_range'][0], $template['price_range'][1]);
                    $newPrice = $oldPrice - $faker->numberBetween(5, 20);
                    
                    $name = $faker->randomElement(['Classic', 'Premium', 'Deluxe', 'Essential', 'Signature']) . ' ' . $template['name'];
                    
                    $imageUrl = "https://picsum.photos/seed/{$category}_{$name}/300/400";
                    
                    Product::create([
                        'name' => $name,
                        'category' => $category,
                        'description' => $faker->paragraph(2),
                        'old_price' => $oldPrice,
                        'price' => $newPrice,
                        'image' => $imageUrl,
                        'stock' => $faker->numberBetween(5, 50),
                        'rating' => $faker->randomFloat(1, 3.5, 5.0),
                        'features' => json_encode($template['features']),
                        'is_featured' => $faker->boolean(20), 
                        'status' => 'active'
                    ]);
                }
            }
        }
    }
} 