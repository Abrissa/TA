<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'degree',
        'role',
        'subjects',
        'image_url',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = [
        'imageUrl',
        'isActive',
    ];

    public function getImageUrlAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['image_url'] ?? null);
    }

    public function getIsActiveAttribute($value = null): bool
    {
        return !empty($value ?? ($this->attributes['is_active'] ?? false));
    }
}

