<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        $todayRevenue = Payment::where('status', 'completed')
            ->whereDate('created_at', today())
            ->sum('amount');
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $totalProducts = Product::where('is_active', true)->count();

        return [
            Stat::make('Total Revenue', '৳ ' . number_format($totalRevenue, 2))
                ->description('All time revenue')
                ->descriptionIcon('heroicon-o-banknotes')
                ->color('success'),
            Stat::make('Today Revenue', '৳ ' . number_format($todayRevenue, 2))
                ->description('Revenue today')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('success'),
            Stat::make('Total Orders', $totalOrders)
                ->description($pendingOrders . ' pending orders')
                ->descriptionIcon('heroicon-o-shopping-cart')
                ->color('primary'),
            Stat::make('Completed Orders', $completedOrders)
                ->description('Successfully completed')
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('success'),
            Stat::make('Active Products', $totalProducts)
                ->description('Products available')
                ->descriptionIcon('heroicon-o-cube')
                ->color('primary'),
        ];
    }
}
