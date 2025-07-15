<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Category extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'image',
        'description',
        'des_short',
        'status',
        'created_by_id',
        'edited_by_id',
        'parent_id',
    ];

    protected $casts = [
        'parent_id' => 'integer',
        'created_by_id' => 'integer',
        'edited_by_id' => 'integer',
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    /**
     * Parent category.
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Child categories.
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Creator relationship (User who created).
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    /**
     * Editor relationship (User who last edited).
     */
    public function editedBy()
    {
        return $this->belongsTo(User::class, 'edited_by_id');
    }

    public function descendants()
    {
        return $this->children()->with('descendants');
    }

    public function scopeIsParent($query)
    {
        return $query->whereNull('parent_id');
    }

}

