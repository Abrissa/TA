<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'category_id',
        'excerpt',
        'content',
        'author',
        'author_role',
        'image_url',
        'is_featured',
        'read_time',
        'source_url',
        'source_name',
        'tags',
        'views_count',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'is_featured' => 'boolean',
            'views_count' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title) . '-' . Str::random(5);
            }
            if (empty($article->published_at) && $article->status === 'published') {
                $article->published_at = now();
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    protected $appends = [
        'imageUrl',
        'authorRole',
        'isFeatured',
        'readTime',
        'date',
    ];

    public function getImageUrlAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['image_url'] ?? null);
    }

    public function getAuthorRoleAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['author_role'] ?? null);
    }

    public function getIsFeaturedAttribute($value = null): bool
    {
        return !empty($value ?? ($this->attributes['is_featured'] ?? false));
    }

    public function getReadTimeAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['read_time'] ?? null);
    }

    public function getDateAttribute(): string
    {
        return $this->published_at ? $this->published_at->format('d M Y') : ($this->created_at ? $this->created_at->format('d M Y') : '');
    }

    public function masterCategory(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MasterCategory::class, 'category_id');
    }
}
