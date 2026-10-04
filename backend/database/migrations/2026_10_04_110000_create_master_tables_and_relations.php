<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Master Academic Years (Tahun Ajaran)
        Schema::create('master_academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. '2025-2026'
            $table->string('name'); // e.g. 'Tahun Ajaran 2025/2026'
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // 2. Master Categories (Kategori Berita, Prestasi, Pengumuman)
        Schema::create('master_categories', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'article', 'achievement', 'announcement'
            $table->string('name'); // e.g. 'Prestasi', 'Kegiatan', 'Informasi', 'Edukasi'
            $table->string('slug');
            $table->string('badge_color')->nullable()->default('emerald');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->unique(['type', 'slug']);
        });

        // 3. Master PPDB Registration Paths (Jalur Pendaftaran PPDB)
        Schema::create('master_ppdb_paths', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // 'REGULER', 'PRESTASI', 'TAHFIDZ', 'AFIRMASI'
            $table->string('name'); // e.g. 'Jalur Reguler Umum', 'Jalur Prestasi Akademik/Non-Akademik'
            $table->text('description')->nullable();
            $table->integer('quota')->default(60);
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 4. Master Alumni Cohorts (Angkatan Kelulusan)
        Schema::create('master_alumni_cohorts', function (Blueprint $table) {
            $table->id();
            $table->string('year')->unique(); // e.g. '2010', '2015', '2024'
            $table->string('name'); // e.g. 'Angkatan 15 (Generasi Bintang)'
            $table->string('motto')->nullable();
            $table->timestamps();
        });

        // 5. Master Roles & Permissions
        Schema::create('master_roles', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // 'superadmin', 'admin_humas', 'operator_ppdb', 'admin_kesiswaan'
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('permissions')->nullable();
            $table->timestamps();
        });

        // Add foreign relations to child/transactional tables
        Schema::table('articles', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('category')->constrained('master_categories')->nullOnDelete();
        });

        Schema::table('achievements', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('category')->constrained('master_categories')->nullOnDelete();
            $table->foreignId('academic_year_id')->nullable()->after('year')->constrained('master_academic_years')->nullOnDelete();
        });

        Schema::table('ppdb_registrations', function (Blueprint $table) {
            $table->foreignId('academic_year_id')->nullable()->after('registration_number')->constrained('master_academic_years')->nullOnDelete();
            $table->foreignId('ppdb_path_id')->nullable()->after('academic_year_id')->constrained('master_ppdb_paths')->nullOnDelete();
        });

        Schema::table('alumni_submissions', function (Blueprint $table) {
            $table->foreignId('cohort_id')->nullable()->after('graduation_year')->constrained('master_alumni_cohorts')->nullOnDelete();
        });

        Schema::table('alumni_profiles', function (Blueprint $table) {
            $table->foreignId('cohort_id')->nullable()->after('graduation_year')->constrained('master_alumni_cohorts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            $table->dropForeign(['cohort_id']);
            $table->dropColumn('cohort_id');
        });

        Schema::table('alumni_submissions', function (Blueprint $table) {
            $table->dropForeign(['cohort_id']);
            $table->dropColumn('cohort_id');
        });

        Schema::table('ppdb_registrations', function (Blueprint $table) {
            $table->dropForeign(['academic_year_id']);
            $table->dropForeign(['ppdb_path_id']);
            $table->dropColumn(['academic_year_id', 'ppdb_path_id']);
        });

        Schema::table('achievements', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropForeign(['academic_year_id']);
            $table->dropColumn(['category_id', 'academic_year_id']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });

        Schema::dropIfExists('master_roles');
        Schema::dropIfExists('master_alumni_cohorts');
        Schema::dropIfExists('master_ppdb_paths');
        Schema::dropIfExists('master_categories');
        Schema::dropIfExists('master_academic_years');
    }
};
