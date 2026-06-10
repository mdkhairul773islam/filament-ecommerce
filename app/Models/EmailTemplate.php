<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class EmailTemplate extends Model
{
    protected $fillable = [
        'name',
        'subject',
        'title',
        'greeting',
        'message',
        'closing',
        'metadata',
        'is_active',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get email template by name with caching
     */
    public static function getByName(string $name): ?self
    {
        $attributes = Cache::remember("email_template.{$name}", 3600, function () use ($name) {
            $template = static::where('name', $name)
                ->where('is_active', true)
                ->first();
            
            return $template ? $template->getAttributes() : null;
        });

        if (!$attributes) {
            return null;
        }

        // Create a fresh instance from cached attributes
        $instance = new static();
        $instance->setRawAttributes($attributes, true);
        $instance->exists = true;
        
        return $instance;
    }

    /**
     * Get metadata field value
     */
    public function getMeta(string $key, $default = null)
    {
        return $this->metadata[$key] ?? $default;
    }

    /**
     * Clear cache when updating
     */
    protected static function booted()
    {
        static::saved(function ($template) {
            Cache::forget("email_template.{$template->name}");
        });

        static::deleted(function ($template) {
            Cache::forget("email_template.{$template->name}");
        });
    }
}
