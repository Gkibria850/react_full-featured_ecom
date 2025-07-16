<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Brand extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'image',
        'description',
        'status',
        'created_by_id',
        'edited_by_id',
       
    ];

    protected $casts = [
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

   
}
