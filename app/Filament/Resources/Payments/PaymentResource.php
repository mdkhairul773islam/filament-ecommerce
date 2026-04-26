<?php

namespace App\Filament\Resources\Payments;

use App\Filament\Resources\Payments\Pages\ManagePayments;
use App\Models\Payment;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PaymentResource extends Resource
{
    protected static ?string $model = Payment::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCreditCard;

    protected static ?string $recordTitleAttribute = 'transaction_id';

    protected static ?string $navigationLabel = 'Payments';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                // Payment Information
                TextInput::make('transaction_id')
                    ->disabled()
                    ->label('Transaction ID')
                    ->columnSpanFull(),

                TextInput::make('order_number_display')
                    ->disabled()
                    ->label('Order Number')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->order?->order_number ?? 'N/A'),

                TextInput::make('payment_method')
                    ->disabled()
                    ->label('Payment Method')
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'bkash' => 'bKash',
                        'rocket' => 'Rocket',
                        'nagad' => 'Nagad',
                        'cash' => 'Cash on Delivery',
                        default => $state ? ucfirst($state) : 'N/A',
                    }),

                TextInput::make('amount')
                    ->disabled()
                    ->prefix('৳')
                    ->label('Amount'),

                Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ])
                    ->required()
                    ->label('Payment Status'),

                DateTimePicker::make('paid_at')
                    ->label('Paid At'),

                // Customer Information
                TextInput::make('customer_name_display')
                    ->disabled()
                    ->label('Customer Name')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->order?->customer_name ?? 'N/A'),

                TextInput::make('customer_email_display')
                    ->disabled()
                    ->label('Customer Email')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->order?->customer_email ?? 'N/A'),

                TextInput::make('customer_phone_display')
                    ->disabled()
                    ->label('Customer Phone')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->order?->customer_phone ?? 'N/A'),

                Textarea::make('customer_address_display')
                    ->disabled()
                    ->label('Customer Address')
                    ->rows(3)
                    ->dehydrated(false)
                    ->columnSpanFull()
                    ->formatStateUsing(fn ($record) => $record?->order?->customer_address ?? 'N/A'),

                // Transaction Details
                TextInput::make('transaction_reference_display')
                    ->disabled()
                    ->label('Transaction Reference')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->payment_details['transaction_reference'] ?? 'N/A'),

                TextInput::make('confirmed_at_display')
                    ->disabled()
                    ->label('Confirmed At')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->payment_details['confirmed_at'] ?? 'N/A'),

                Textarea::make('payment_details_display')
                    ->disabled()
                    ->label('Payment Details')
                    ->rows(6)
                    ->dehydrated(false)
                    ->columnSpanFull()
                    ->formatStateUsing(function ($record) {
                        if (! $record || ! $record->payment_details) {
                            return 'No payment details available';
                        }

                        $details = $record->payment_details;
                        $text = '';

                        if (isset($details['transaction_reference'])) {
                            $text .= 'Transaction Reference: '.$details['transaction_reference']."\n";
                        }

                        if (isset($details['confirmed_at'])) {
                            $text .= 'Confirmed At: '.$details['confirmed_at']."\n";
                        }

                        // Add any other details
                        foreach ($details as $key => $value) {
                            if (! in_array($key, ['transaction_reference', 'confirmed_at'])) {
                                $text .= ucfirst(str_replace('_', ' ', $key)).': '.(is_array($value) ? json_encode($value) : $value)."\n";
                            }
                        }

                        return $text ?: 'No additional details';
                    }),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('transaction_id')
            ->columns([
                TextColumn::make('transaction_id')
                    ->searchable()
                    ->sortable()
                    ->label('Transaction ID')
                    ->copyable(),

                TextColumn::make('order.order_number')
                    ->searchable()
                    ->sortable()
                    ->label('Order Number')
                    ->url(fn (Payment $record) => $record->order ? route('filament.admin.resources.orders.edit', $record->order) : null),

                TextColumn::make('order.customer_name')
                    ->searchable()
                    ->label('Customer'),

                TextColumn::make('payment_method')
                    ->badge()
                    ->label('Method')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'bkash' => 'bKash',
                        'rocket' => 'Rocket',
                        'nagad' => 'Nagad',
                        'cash' => 'Cash on Delivery',
                        default => ucfirst($state),
                    }),

                TextColumn::make('amount')
                    ->money('BDT')
                    ->sortable()
                    ->label('Amount'),

                TextColumn::make('status')
                    ->badge()
                    ->sortable()
                    ->label('Status')
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'completed' => 'success',
                        'failed' => 'danger',
                        'refunded' => 'info',
                        default => 'gray',
                    }),

                TextColumn::make('paid_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Paid At')
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Created At')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ]),
                SelectFilter::make('payment_method')
                    ->options([
                        'bkash' => 'bKash',
                        'rocket' => 'Rocket',
                        'nagad' => 'Nagad',
                        'cash' => 'Cash on Delivery',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManagePayments::route('/'),
        ];
    }
}
