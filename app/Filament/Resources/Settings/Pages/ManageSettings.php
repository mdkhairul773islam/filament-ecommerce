<?php

namespace App\Filament\Resources\Settings\Pages;

use App\Filament\Resources\Settings\SettingResource;
use App\Models\Setting;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageSettings extends ManageRecords
{
    protected static string $resource = SettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
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
                ->after(function () {
                    Setting::clearCache();
                }),
        ];
    }
}
