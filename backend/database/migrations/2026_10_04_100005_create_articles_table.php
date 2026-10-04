<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Kegiatan');
            $table->text('excerpt');
            $table->longText('content');
            $table->string('author')->default('Humas MI Al-Ahmad');
            $table->string('author_role')->default('Tim Redaksi');
            $table->string('image_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('read_time')->default('3 menit');
            $table->string('source_url')->nullable();
            $table->string('source_name')->nullable();
            $table->json('tags')->nullable();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
