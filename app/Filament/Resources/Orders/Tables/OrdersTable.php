<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->searchable()
                    ->sortable()
                    ->label('Order #')
                    ->copyable(),

                TextColumn::make('user.name')
                    ->searchable()
                    ->label('User')
                    ->toggleable(),

                TextColumn::make('customer_name')
                    ->searchable()
                    ->label('Customer'),

                TextColumn::make('status')
                    ->badge()
                    ->sortable()
                    ->label('Order Status')
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'processing' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('payment.status')
                    ->badge()
                    ->sortable()
                    ->label('Payment Status')
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'completed' => 'success',
                        'failed' => 'danger',
                        'refunded' => 'info',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                TextColumn::make('payment.payment_method')
                    ->label('Payment Method')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'bkash' => 'bKash',
                        'rocket' => 'Rocket',
                        'nagad' => 'Nagad',
                        'cash' => 'Cash',
                        default => ucfirst($state),
                    })
                    ->toggleable(),

                TextColumn::make('total')
                    ->money('BDT')
                    ->sortable()
                    ->label('Total'),

                TextColumn::make('customer_phone')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('customer_email')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Created')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Order Status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
                SelectFilter::make('payment.status')
                    ->label('Payment Status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ]),
            ])
            ->recordActions([
                Action::make('whatsapp')
                    ->label('WhatsApp')
                    ->icon('heroicon-o-chat-bubble-left-ellipsis')
                    ->color('success')
                    ->url(function ($record): string {
                        $phone = preg_replace('/\D/', '', $record->customer_phone);
                        if (str_starts_with($phone, '0') && strlen($phone) === 11) {
                            $phone = '880'.substr($phone, 1);
                        }

                        $productList = $record->items->map(
                            fn ($item) => '• '.$item->product_name.' (x'.$item->quantity.')'
                        )->implode("\n");

                        $message = "আসসালামু আলাইকুম {$record->customer_name}! 👋\n\n"
                            ."আপনার অর্ডার *#{$record->order_number}* সফলভাবে গ্রহণ করা হয়েছে।\n\n"
                            ."আপনার ক্রয়কৃত পণ্যসমূহ:\n{$productList}\n\n"
                            .'মোট: ৳'.number_format($record->total, 2)."\n\n"
                            .'ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য! 🙏';

                        return 'https://wa.me/'.$phone.'?text='.rawurlencode($message);
                    })
                    ->openUrlInNewTab()
                    ->visible(fn ($record): bool => filled($record->customer_phone)),
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
