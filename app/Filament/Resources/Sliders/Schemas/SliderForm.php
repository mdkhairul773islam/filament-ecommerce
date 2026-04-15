<?php

namespace App\Filament\Resources\Sliders\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SliderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->default(null),
                Textarea::make('description')
                    ->default(null)
                    ->columnSpanFull(),
                FileUpload::make('image')
                    ->image()
                    ->disk('public')
                    ->directory('sliders'),
                FileUpload::make('video')
                    ->disk('public')
                    ->acceptedFileTypes(['video/mp4', 'video/mkv', 'video/webm'])
                    ->maxSize(20480)
                    ->directory('sliders/videos'),
                TextInput::make('button_text')
                    ->default(null),
                TextInput::make('button_link')
                    ->default(null),
                Toggle::make('is_active')
                    ->default(true)
                    ->required(),
            ]);
    }
}
