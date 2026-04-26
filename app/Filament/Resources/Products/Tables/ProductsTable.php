<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('category.name')
                    ->searchable(),
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('slug')
                    ->searchable(),
                TextColumn::make('type')
                    ->badge(),
                TextColumn::make('price')
                    ->money('BDT')
                    ->sortable(),
                TextColumn::make('discount_price')
                    ->money('BDT')
                    ->sortable(),
                ImageColumn::make('image')
                    ->disk('public'),
                TextColumn::make('stock')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('author')
                    ->searchable(),
                TextColumn::make('duration')
                    ->searchable(),
                IconColumn::make('is_featured')
                    ->boolean(),
                IconColumn::make('is_active')
                    ->boolean(),
                IconColumn::make('digital_file')
                    ->label('Digital File')
                    ->icon(fn ($state) => $state ? 'heroicon-o-document-text' : 'heroicon-o-minus')
                    ->color(fn ($state) => $state ? 'success' : 'gray')
                    ->tooltip(fn ($record) => $record->digital_file ? 'PDF uploaded' : 'No digital file'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
