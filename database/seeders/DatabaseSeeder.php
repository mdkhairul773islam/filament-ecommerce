<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed payment methods first
        $this->call(PaymentMethodSeeder::class);

        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create test user
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create categories
        $categories = [
            [
                'name' => 'Programming',
                'slug' => 'programming',
                'description' => 'Books and courses about programming',
                'is_active' => true,
            ],
            [
                'name' => 'Web Development',
                'slug' => 'web-development',
                'description' => 'Learn web development',
                'is_active' => true,
            ],
            [
                'name' => 'Data Science',
                'slug' => 'data-science',
                'description' => 'Data science and machine learning',
                'is_active' => true,
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'description' => 'Business and entrepreneurship',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::create($categoryData);

            // Create products for each category
            for ($i = 1; $i <= 5; $i++) {
                $type = $i % 2 == 0 ? 'course' : 'book';
                $price = rand(500, 5000);
                
                Product::create([
                    'category_id' => $category->id,
                    'name' => ucfirst($type) . ' ' . $i . ' - ' . $category->name,
                    'slug' => strtolower($type) . '-' . $i . '-' . $category->slug,
                    'type' => $type,
                    'description' => 'This is a comprehensive ' . $type . ' about ' . $category->name . '. Learn everything you need to know.',
                    'content' => 'Detailed content about this ' . $type . '. Includes practical examples and exercises.',
                    'price' => $price,
                    'discount_price' => $i == 1 ? $price * 0.8 : null,
                    'stock' => rand(10, 100),
                    'author' => 'Author ' . rand(1, 10),
                    'duration' => $type == 'course' ? rand(10, 50) . ' hours' : rand(200, 500) . ' pages',
                    'is_featured' => $i <= 2,
                    'is_active' => true,
                ]);
            }
        }
    }
}
