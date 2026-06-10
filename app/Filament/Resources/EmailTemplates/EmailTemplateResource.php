<?php

namespace App\Filament\Resources\EmailTemplates;

use App\Filament\Resources\EmailTemplates\Pages\ManageEmailTemplates;
use App\Models\EmailTemplate;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class EmailTemplateResource extends Resource
{
    protected static ?string $model = EmailTemplate::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelope;

    protected static ?string $navigationLabel = 'Message Templates';

    protected static ?int $navigationSort = 98;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Template Information')
                    ->description('Manage email and WhatsApp message templates')
                    ->schema([
                        TextInput::make('name')
                            ->label('Template Name')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->helperText('Unique identifier (e.g., order_digital_product, whatsapp_order_digital_product)')
                            ->disabled(fn ($record) => $record !== null), // Prevent editing name on existing records

                        TextInput::make('subject')
                            ->label('Email Subject')
                            ->maxLength(255)
                            ->helperText('Email subject line (not used for WhatsApp templates)'),

                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Enable/disable this template'),
                    ]),

                Section::make('Message Content')
                    ->schema([
                        TextInput::make('title')
                            ->label('Title')
                            ->maxLength(500)
                            ->helperText('Main heading (used for emails)'),

                        TextInput::make('greeting')
                            ->label('Greeting')
                            ->maxLength(255)
                            ->helperText('E.g., "প্রিয়", "Dear", "আসসালামু আলাইকুম"'),

                        Textarea::make('message')
                            ->label('Message')
                            ->rows(5)
                            ->helperText('Main message body'),

                        TextInput::make('closing')
                            ->label('Closing')
                            ->maxLength(255)
                            ->helperText('E.g., "ধন্যবাদ," or "Thanks,"'),
                    ]),

                Section::make('Additional Fields')
                    ->schema([
                        KeyValue::make('metadata')
                            ->label('Custom Fields')
                            ->keyLabel('Field Name')
                            ->valueLabel('Field Value')
                            ->helperText('Add custom fields for this template (e.g., table headers, labels)')
                            ->reorderable(),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Template')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('subject')
                    ->label('Subject')
                    ->searchable()
                    ->limit(50),

                TextColumn::make('title')
                    ->label('Title')
                    ->limit(40)
                    ->searchable(),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime('d M Y, h:i A')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('name');
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageEmailTemplates::route('/'),
        ];
    }
}
