<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlumniSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'graduation_year',
        'cohort_id',
        'job_role',
        'photo_url',
        'social_media',
        'phone',
        'email',
        'message',
        'status',
        'notes',
        'reviewed_at',
        'reviewed_by',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(MasterAlumniCohort::class, 'cohort_id');
    }
}
