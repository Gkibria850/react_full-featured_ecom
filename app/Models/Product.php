<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Product extends Model
{
    use HasSlug, HasFactory;

    protected $fillable = [
        // Basic details
        'name',
        'slug',
        'description',

        // Pricing
        'price',
        'original_price',

        // Brand and Category
        'category_id',
        'brand_id',

        // Product Details
        'model',
        'sku',
        'barcode',
        'status',
        'quantity',

        // Ratings
        'rating',
        'review_count',

        // Feature Sections
        'features',
        'new_arrival',
        'popular',
        'on_sale',
        'best_sale',
        'colors',
        'sizes',

        // Media
        'image',
        'images',

        // Flags
        'is_featured',
        'is_popular',
        'is_on_sale',
        'is_best_sale',
        'is_new_arrival',
        'in_stock',
    ];

    protected $casts = [
        'features' => 'array',
        'new_arrival' => 'array',
        'popular' => 'array',
        'on_sale' => 'array',
        'best_sale' => 'array',
        'colors' => 'array',
        'sizes' => 'array',
        'images' => 'array',
        'is_featured' => 'boolean',
        'is_popular' => 'boolean',
        'is_on_sale' => 'boolean',
        'is_best_sale' => 'boolean',
        'is_new_arrival' => 'boolean',
        'in_stock' => 'boolean',
    ];

    /**
     * Relationship: Product belongs to a Brand
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
   public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }
    /**
     * Relationship: Product belongs to a Category
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relationship: Product has many Variation Types
     */
    public function variationTypes(): HasMany
    {
        return $this->hasMany(VariationType::class);
    }

    /**
     * Relationship: Product has many Variations (combinations)
     */
    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }
}
