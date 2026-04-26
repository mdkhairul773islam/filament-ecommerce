<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'type',
        'description',
        'content',
        'price',
        'discount_price',
        'discount_type',
        'image',
        'images',
        'stock',
        'author',
        'duration',
        'is_featured',
        'is_active',
        'show_discount_badge',
        'specification',
        'author_details',
        'look_inside_type',
        'look_inside_pdf',
        'look_inside_images',
        'look_inside_text',
        'digital_file',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'images' => 'array',
        'look_inside_images' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'show_discount_badge' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function getFinalPriceAttribute(): string
    {
        if (! $this->discount_price) {
            return $this->price;
        }

        if ($this->discount_type === 'flat') {
            return bcsub((string) $this->price, (string) $this->discount_price, 2);
        }

        // percentage
        $discountAmount = bcmul((string) $this->price, bcdiv((string) $this->discount_price, '100', 4), 2);

        return bcsub((string) $this->price, $discountAmount, 2);
    }
}
