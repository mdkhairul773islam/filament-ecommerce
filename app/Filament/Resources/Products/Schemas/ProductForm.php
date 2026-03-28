<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Select::make('type')
                    ->options(['book' => 'Book', 'course' => 'Course'])
                    ->default('book')
                    ->required(),
                Textarea::make('description')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('content')
                    ->default(null)
                    ->columnSpanFull(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('৳'),
                TextInput::make('discount_price')
                    ->numeric()
                    ->default(null)
                    ->prefix('৳')
                    ->helperText('Enter flat amount or percentage value'),
                Select::make('discount_type')
                    ->options([
                        'percentage' => 'Percentage (%)',
                        'flat' => 'Flat Amount (৳)',
                    ])
                    ->default('percentage')
                    ->required()
                    ->helperText('Select how discount should be applied'),
                FileUpload::make('image')
                    ->image()
                    ->disk('public')
                    ->visibility('public')
                    ->getUploadedFileNameForStorageUsing(
                        fn ($file) => 'products/' . $file->hashName()
                    ),
                Textarea::make('images')
                    ->default(null)
                    ->columnSpanFull(),
                TextInput::make('stock')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('author')
                    ->default(null),
                TextInput::make('duration')
                    ->default(null),
                Toggle::make('is_featured')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
                Toggle::make('show_discount_badge')
                    ->label('Show Discount Badge')
                    ->helperText('Display discount percentage badge on product cards')
                    ->default(true),
            ]);
    }
}
