<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentMethods = [
            [
                'name' => 'bKash',
                'code' => 'bkash',
                'description' => 'Pay using bKash mobile wallet',
                'logo' => null,
                'config' => [
                    'merchant_number' => '01XXXXXXXXX',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Rocket',
                'code' => 'rocket',
                'description' => 'Pay using Rocket mobile banking',
                'logo' => null,
                'config' => [
                    'merchant_number' => '01XXXXXXXXX',
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Nagad',
                'code' => 'nagad',
                'description' => 'Pay using Nagad mobile wallet',
                'logo' => null,
                'config' => [
                    'merchant_number' => '01XXXXXXXXX',
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Cash on Delivery',
                'code' => 'cash',
                'description' => 'Pay with cash when you receive your order',
                'logo' => null,
                'config' => [],
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($paymentMethods as $method) {
            PaymentMethod::create($method);
        }
    }
}
