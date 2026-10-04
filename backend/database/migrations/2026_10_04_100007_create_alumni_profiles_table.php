<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumni_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('graduation_year');
            $table->string('title')->nullable();
            $table->string('current_role');
            $table->text('bio');
            $table->text('quote')->nullable();
            $table->string('image_url')->nullable();
            $table->string('social_url')->nullable();
            $table->string('category_badge')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->foreignId('submission_id')->nullable()->constrained('alumni_submissions')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumni_profiles');
    }
};
