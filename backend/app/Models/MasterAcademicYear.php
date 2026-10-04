<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterAcademicYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function ppdbRegistrations(): HasMany
    {
        return $this->hasMany(PpdbRegistration::class, 'academic_year_id');
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class, 'academic_year_id');
    }
}
