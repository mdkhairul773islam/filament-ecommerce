<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
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
                    ->columnSpanFull()
                    ->label('Summary'),
                RichEditor::make('content')
                    ->default(null)
                    ->columnSpanFull()
                    ->label('Additional Details'),
                RichEditor::make('specification')
                    ->default(null)
                    ->columnSpanFull()
                    ->label('Specification'),
                RichEditor::make('author_details')
                    ->default(null)
                    ->columnSpanFull()
                    ->label('Author Details'),

                Section::make('Look Inside')
                    ->schema([
                        Select::make('look_inside_type')
                            ->label('Content Type')
                            ->options([
                                'pdf' => 'PDF Document',
                                'text' => 'Rich Text',
                            ])
                            ->reactive()
                            ->default(null),

                        FileUpload::make('look_inside_pdf')
                            ->label('PDF File')
                            ->disk('public')
                            ->directory('look_inside/pdfs')
                            ->acceptedFileTypes(['application/pdf'])
                            ->visible(fn ($get) => $get('look_inside_type') === 'pdf'),

                        RichEditor::make('look_inside_text')
                            ->label('Read a Little (Text)')
                            ->visible(fn ($get) => $get('look_inside_type') === 'text')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed(true)
                    ->columns(1),

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
                FileUpload::make('digital_file')
                    ->label('Digital File (PDF)')
                    ->disk('public')
                    ->directory('products/digital')
                    ->acceptedFileTypes(['application/pdf'])
                    ->downloadable()
                    ->openable()
                    ->helperText('Upload the PDF that will be delivered to customers after ordering')
                    ->columnSpanFull(),
                FileUpload::make('image')
                    ->image()
                    ->disk('public')
                    ->visibility('public')
                    ->getUploadedFileNameForStorageUsing(
                        fn ($file) => 'products/'.$file->hashName()
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
