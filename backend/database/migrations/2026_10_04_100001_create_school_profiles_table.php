<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('MI Al-Ahmad Krian Sidoarjo');
            $table->string('npsn')->default('60717281');
            $table->string('accreditation')->default('A (Unggul)');
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->text('vision')->nullable();
            $table->json('mission')->nullable();
            $table->json('objectives')->nullable();
            $table->string('principal_name')->nullable();
            $table->text('principal_greeting')->nullable();
            $table->string('principal_image_url')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->text('maps_embed_url')->nullable();
            $table->string('social_instagram')->nullable();
            $table->string('social_facebook')->nullable();
            $table->string('social_youtube')->nullable();
            $table->string('social_tiktok')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_profiles');
    }
};
