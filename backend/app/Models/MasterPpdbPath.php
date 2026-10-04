<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterPpdbPath extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'quota',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'quota' => 'integer',
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(PpdbRegistration::class, 'ppdb_path_id');
    }
}
