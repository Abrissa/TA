<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'category_id',
        'date',
        'is_important',
        'file_link',
    ];

    protected function casts(): array
    {
        return [
            'is_important' => 'boolean',
        ];
    }

    public function masterCategory(): BelongsTo
    {
        return $this->belongsTo(MasterCategory::class, 'category_id');
    }
}
