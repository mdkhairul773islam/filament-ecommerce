<?php

namespace App\Filament\Resources\Settings;

use App\Models\Setting;
use BackedEnum;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\RichEditor;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SettingResource extends Resource
{
    protected static ?string $model = Setting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static ?string $navigationLabel = 'Settings';

    protected static ?int $navigationSort = 99;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Setting Details')
                    ->schema([
                        TextInput::make('key')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->label('Setting Key')
                            ->helperText('Unique identifier for this setting'),

                        Select::make('type')
                            ->required()
                            ->options([
                                'text' => 'Text',
                                'textarea' => 'Textarea',
                                'richtext' => 'Rich Text',
                                'image' => 'Image',
                                'email' => 'Email',
                                'phone' => 'Phone',
                            ])
                            ->default('text')
                            ->reactive()
                            ->label('Type'),

                        Select::make('group')
                            ->required()
                            ->options([
                                'general' => 'General',
                                'appearance' => 'Appearance',
                                'contact' => 'Contact',
                                'social' => 'Social Media',
                                'pages' => 'Pages',
                            ])
                            ->default('general')
                            ->label('Group'),
                    ]),

                Section::make('Value')
                    ->schema([
                        TextInput::make('value_text')
                            ->label('Value')
                            ->maxLength(500)
                            ->visible(fn ($get) => in_array($get('type'), ['text', 'email', 'phone'])),

                        Textarea::make('value_textarea')
                            ->label('Value')
                            ->rows(4)
                            ->visible(fn ($get) => $get('type') === 'textarea'),

                        RichEditor::make('value_richtext')
                            ->label('Value')
                            ->visible(fn ($get) => $get('type') === 'richtext'),

                        FileUpload::make('value_image')
                            ->label('Image')
                            ->image()
                            ->disk('public')
                            ->directory('settings')
                            ->maxSize(2048)
                            ->visible(fn ($get) => $get('type') === 'image'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),

                TextColumn::make('key')
                    ->searchable()
                    ->sortable()
                    ->label('Setting Key')
                    ->weight('medium')
                    ->copyable(),

                TextColumn::make('value')
                    ->label('Value')
                    ->limit(60)
                    ->searchable()
                    ->placeholder('(empty)')
                    ->wrap()
                    ->copyable(),

                TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'image' => 'success',
                        'textarea' => 'warning',
                        'email' => 'info',
                        'phone' => 'info',
                        default => 'gray',
                    })
                    ->label('Type')
                    ->sortable(),

                TextColumn::make('group')
                    ->badge()
                    ->label('Group')
                    ->sortable()
                    ->color(fn (string $state): string => match ($state) {
                        'general' => 'success',
                        'appearance' => 'warning',
                        'contact' => 'info',
                        'social' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('Created'),

                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('Updated'),
            ])
            ->defaultSort('id', 'asc')
            ->paginated([10, 25, 50, 100])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make()
                    ->mutateRecordDataUsing(function (array $data): array {
                        $type = $data['type'] ?? 'text';
                        if (in_array($type, ['text', 'email', 'phone'])) {
                            $data['value_text'] = $data['value'] ?? null;
                        } else {
                            $data['value_' . $type] = $data['value'] ?? null;
                        }
                        return $data;
                    })
                    ->mutateFormDataUsing(function (array $data): array {
                        $type = $data['type'] ?? 'text';
                        if (in_array($type, ['text', 'email', 'phone'])) {
                            $value = $data['value_text'] ?? null;
                        } else {
                            $value = $data['value_' . $type] ?? null;
                        }
                        $data['value'] = $value;
                        unset($data['value_text'], $data['value_textarea'], $data['value_richtext'], $data['value_image']);
                        return $data;
                    })
                    ->after(fn () => Setting::clearCache()),
                DeleteAction::make()
                    ->after(fn () => Setting::clearCache()),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->striped();
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageSettings::route('/'),
        ];
    }
}
