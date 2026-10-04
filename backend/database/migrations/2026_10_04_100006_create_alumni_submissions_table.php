<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumni_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('graduation_year');
            $table->string('job_role');
            $table->string('photo_url')->nullable();
            $table->string('social_media')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('message');
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumni_submissions');
    }
};
