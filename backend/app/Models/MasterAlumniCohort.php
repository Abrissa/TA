<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterAlumniCohort extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'name',
        'motto',
    ];

    public function submissions(): HasMany
    {
        return $this->hasMany(AlumniSubmission::class, 'cohort_id');
    }

    public function profiles(): HasMany
    {
        return $this->hasMany(AlumniProfile::class, 'cohort_id');
    }
}
