<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppdb_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->string('child_full_name');
            $table->string('gender');
            $table->string('birth_place');
            $table->date('birth_date');
            $table->string('parent_name');
            $table->string('whatsapp');
            $table->text('address');
            $table->string('previous_school')->nullable();
            $table->string('status')->default('menunggu_verifikasi');
            $table->text('admin_notes')->nullable();
            $table->timestamp('registered_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppdb_registrations');
    }
};
