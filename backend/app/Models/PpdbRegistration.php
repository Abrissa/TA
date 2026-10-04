<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PpdbRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_number',
        'academic_year_id',
        'ppdb_path_id',
        'child_full_name',
        'gender',
        'birth_place',
        'birth_date',
        'parent_name',
        'whatsapp',
        'address',
        'previous_school',
        'status',
        'admin_notes',
        'registered_at',
        'reviewed_at',
        'reviewed_by',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'registered_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function ($reg) {
            if (empty($reg->registration_number)) {
                $count = static::whereYear('created_at', now()->year)->count() + 1;
                $reg->registration_number = 'PPDB-' . date('Y') . '-' . str_pad((string)$count, 4, '0', STR_PAD_LEFT);
            }
            if (empty($reg->registered_at)) {
                $reg->registered_at = now();
            }
        });
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function masterAcademicYear(): BelongsTo
    {
        return $this->belongsTo(MasterAcademicYear::class, 'academic_year_id');
    }

    public function masterPath(): BelongsTo
    {
        return $this->belongsTo(MasterPpdbPath::class, 'ppdb_path_id');
    }
}
