<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarAgenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_day',
        'date_month',
        'title',
        'time',
        'location',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }
}
