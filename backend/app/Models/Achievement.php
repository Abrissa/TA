<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'category_id',
        'academic_year_id',
        'date',
        'year',
        'rank',
        'event',
        'winner',
        'winner_role',
        'description',
        'image_url',
        'details',
        'medals',
        'highlight',
        'is_highlighted',
    ];

    protected $casts = [
        'details' => 'array',
        'medals' => 'array',
        'is_highlighted' => 'boolean',
    ];

    protected $appends = [
        'imageUrl',
        'winnerRole',
        'isHighlighted',
    ];

    public function getImageUrlAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['image_url'] ?? null);
    }

    public function getWinnerRoleAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['winner_role'] ?? null);
    }

    public function getIsHighlightedAttribute($value = null): bool
    {
        return !empty($value ?? ($this->attributes['is_highlighted'] ?? false));
    }

    public function masterCategory(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MasterCategory::class, 'category_id');
    }

    public function masterAcademicYear(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MasterAcademicYear::class, 'academic_year_id');
    }
}

