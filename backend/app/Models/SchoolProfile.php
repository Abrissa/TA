<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'npsn',
        'accreditation',
        'tagline',
        'description',
        'vision',
        'mission',
        'objectives',
        'principal_name',
        'principal_greeting',
        'principal_image_url',
        'logo_url',
        'hero_image_url',
        'phone',
        'whatsapp',
        'email',
        'address',
        'maps_embed_url',
        'social_instagram',
        'social_facebook',
        'social_youtube',
        'social_tiktok',
    ];

    protected function casts(): array
    {
        return [
            'mission' => 'array',
            'objectives' => 'array',
        ];
    }
}
