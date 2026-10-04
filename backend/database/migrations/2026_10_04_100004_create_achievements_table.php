<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->default('Nasional');
            $table->string('date')->nullable();
            $table->string('year')->nullable();
            $table->string('rank')->nullable();
            $table->string('event')->nullable();
            $table->string('winner');
            $table->string('winner_role')->nullable();
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->json('details')->nullable();
            $table->json('medals')->nullable();
            $table->string('highlight')->nullable();
            $table->boolean('is_highlighted')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
