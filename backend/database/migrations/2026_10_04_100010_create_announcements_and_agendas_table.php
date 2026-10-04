<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->default('Kegiatan');
            $table->string('date');
            $table->boolean('is_important')->default(false);
            $table->string('file_link')->nullable();
            $table->timestamps();
        });

        Schema::create('calendar_agendas', function (Blueprint $table) {
            $table->id();
            $table->string('date_day');
            $table->string('date_month');
            $table->string('title');
            $table->string('time');
            $table->string('location');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar_agendas');
        Schema::dropIfExists('announcements');
    }
};
