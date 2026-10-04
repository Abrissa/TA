<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlumniProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'graduation_year',
        'cohort_id',
        'title',
        'current_role',
        'bio',
        'quote',
        'image_url',
        'social_url',
        'category_badge',
        'is_active',
        'order',
        'submission_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = [
        'imageUrl',
        'graduationYear',
        'profession',
        'currentRole',
        'categoryBadge',
        'socialUrl',
        'isActive',
    ];

    public function getImageUrlAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['image_url'] ?? null);
    }

    public function getGraduationYearAttribute($value = null): ?string
    {
        $raw = $value ?? ($this->attributes['graduation_year'] ?? '');
        return preg_replace('/^[^\d]*/', '', (string)$raw);
    }

    public function getProfessionAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['current_role'] ?? ($this->attributes['title'] ?? null));
    }

    public function getCurrentRoleAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['current_role'] ?? null);
    }

    public function getCategoryBadgeAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['category_badge'] ?? null);
    }

    public function getSocialUrlAttribute($value = null): ?string
    {
        return $value ?? ($this->attributes['social_url'] ?? null);
    }

    public function getIsActiveAttribute($value = null): bool
    {
        return !empty($value ?? ($this->attributes['is_active'] ?? false));
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(AlumniSubmission::class, 'submission_id');
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(MasterAlumniCohort::class, 'cohort_id');
    }
}

