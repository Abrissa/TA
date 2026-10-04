<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'slug',
        'badge_color',
        'description',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'category_id');
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class, 'category_id');
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class, 'category_id');
    }
}
