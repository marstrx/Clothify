<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Latest gadgets and electronic devices',
                'image' => 'categories/electronics.jpg'
            ],
            [
                'name' => 'Home & Kitchen',
                'description' => 'Everything for your home and kitchen needs',
                'image' => 'categories/home-kitchen.jpg'
            ],
            [
                'name' => 'Fashion',
                'description' => 'Trendy clothing and accessories',
                'image' => 'categories/fashion.jpg'
            ],
            [
                'name' => 'Sports & Outdoors',
                'description' => 'Sports equipment and outdoor gear',
                'image' => 'categories/sports.jpg'
            ],
            [
                'name' => 'Books & Media',
                'description' => 'Books, movies, and music',
                'image' => 'categories/books.jpg'
            ],
            [
                'name' => 'Beauty & Personal Care',
                'description' => 'Beauty products and personal care items',
                'image' => 'categories/beauty.jpg'
            ]
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'image' => $category['image']
            ]);
        }
    }
} 