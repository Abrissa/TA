<?php

namespace Tests\Feature;

use App\Models\Achievement;
use App\Models\AlumniSubmission;
use App\Models\Announcement;
use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SchoolApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_public_profile_endpoint_returns_school_data(): void
    {
        $response = $this->getJson('/api/v1/profile');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.npsn', '60717281');
    }

    public function test_public_articles_endpoint_returns_published_articles(): void
    {
        $response = $this->getJson('/api/v1/articles');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_public_can_submit_alumni_form(): void
    {
        $payload = [
            'fullName' => 'Muhammad Zidan, S.Kom',
            'graduationYear' => '2016',
            'jobRole' => 'Mobile Developer',
            'message' => 'Bangga pernah menuntut ilmu di MI Al-Ahmad.',
            'phone' => '081234567890',
        ];

        $response = $this->postJson('/api/v1/alumni/submit', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('alumni_submissions', [
            'full_name' => 'Muhammad Zidan, S.Kom',
            'status' => 'pending',
        ]);
    }

    public function test_public_can_register_for_ppdb(): void
    {
        $payload = [
            'childFullName' => 'Fathir Ahmad Pratama',
            'gender' => 'Laki-laki',
            'birthPlace' => 'Sidoarjo',
            'birthDate' => '2019-05-10',
            'parentName' => 'Bambang Pratama',
            'whatsapp' => '081299887766',
            'address' => 'Jl. Merpati No. 4, Krian, Sidoarjo',
            'previousSchool' => 'TK Dharma Wanita Krian',
        ];

        $response = $this->postJson('/api/v1/ppdb/register', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.child_full_name', 'Fathir Ahmad Pratama')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('ppdb_registrations', [
            'child_full_name' => 'Fathir Ahmad Pratama',
            'status' => 'pending',
        ]);
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        Cache::put('captcha:test-key', 'ABCDE', now()->addMinutes(5));

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@mialahmad.sch.id',
            'password' => 'admin123',
            'captcha_key' => 'test-key',
            'captcha' => 'ABCDE',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['token', 'user'],
            ]);
    }

    public function test_login_fails_with_invalid_password(): void
    {
        Cache::put('captcha:test-key', 'ABCDE', now()->addMinutes(5));

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@mialahmad.sch.id',
            'password' => 'wrongpassword',
            'captcha_key' => 'test-key',
            'captcha' => 'ABCDE',
        ]);

        $response->assertStatus(422);
    }

    public function test_login_fails_with_invalid_captcha(): void
    {
        Cache::put('captcha:test-key', 'ABCDE', now()->addMinutes(5));

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@mialahmad.sch.id',
            'password' => 'admin123',
            'captcha_key' => 'test-key',
            'captcha' => 'WRONG',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_unauthenticated_user_cannot_access_admin_endpoints(): void
    {
        $response = $this->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(401);
    }

    public function test_authenticated_admin_can_access_dashboard_stats(): void
    {
        $admin = User::where('email', 'admin@mialahmad.sch.id')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['stats', 'recent_ppdb', 'recent_alumni', 'recent_articles'],
            ]);
    }

    public function test_admin_can_create_article(): void
    {
        $admin = User::where('email', 'admin@mialahmad.sch.id')->first();

        $payload = [
            'title' => 'Kunjungan Edukasi Ke Planetarium Surabaya',
            'category' => 'Kegiatan',
            'excerpt' => 'Siswa kelas 4 dan 5 MI Al-Ahmad mengikuti pembelajaran luar kelas.',
            'content' => 'Rombongan siswa dan guru pendamping bertolak dari madrasah pada pagi hari...',
            'author' => 'Humas Madrasah',
            'status' => 'published',
        ];

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/articles', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Kunjungan Edukasi Ke Planetarium Surabaya');

        $this->assertDatabaseHas('articles', [
            'title' => 'Kunjungan Edukasi Ke Planetarium Surabaya',
        ]);
    }

    public function test_admin_can_update_page_display_settings(): void
    {
        $admin = User::where('email', 'admin@mialahmad.sch.id')->first();

        $payload = [
            'settings' => [
                ['key' => 'section_hero_visible', 'value' => false],
                ['key' => 'announcement_banner_text', 'value' => 'Pengumuman baru telah terbit.'],
            ],
        ];

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/settings', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('site_settings', [
            'key' => 'announcement_banner_text',
            'value' => 'Pengumuman baru telah terbit.',
        ]);
    }

    public function test_admin_can_access_master_data_overview(): void
    {
        $admin = User::where('email', 'admin@mialahmad.sch.id')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/master-data');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['academic_years', 'categories', 'ppdb_paths', 'cohorts', 'roles'],
            ]);
    }

    public function test_master_and_child_database_relationships_are_intact(): void
    {
        $admin = User::where('email', 'admin@mialahmad.sch.id')->first();
        $this->assertNotNull($admin->role_id);
        $this->assertNotNull($admin->masterRole);
        $this->assertEquals('superadmin', $admin->masterRole->code);

        $article = Article::whereNotNull('category_id')->first();
        $this->assertNotNull($article);
        $this->assertNotNull($article->masterCategory);

        $achievement = Achievement::whereNotNull('category_id')->first();
        $this->assertNotNull($achievement);
        $this->assertNotNull($achievement->masterCategory);

        $announcement = Announcement::whereNotNull('category_id')->first();
        $this->assertNotNull($announcement);
        $this->assertNotNull($announcement->masterCategory);
    }

    public function test_admin_can_upload_media_image_to_storage(): void
    {
        Storage::fake('public');

        $admin = User::where('email', 'admin@mialahmad.sch.id')->first();
        $file = UploadedFile::fake()->image('prestasi-santri.jpg', 640, 480);

        $response = $this->actingAs($admin, 'sanctum')->post('/api/admin/media/upload', [
            'file' => $file,
            'folder' => 'articles',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['path', 'url', 'filename', 'size'],
            ]);

        $path = $response->json('data.path');
        Storage::disk('public')->assertExists($path);
    }

    public function test_admin_can_delete_alumni_submission(): void
    {
        $admin = User::where('email', 'admin@mialahmad.sch.id')->first();
        $submission = AlumniSubmission::create([
            'full_name' => 'Fulan bin Fulan',
            'graduation_year' => '2019',
            'job_role' => 'Data Analyst',
            'phone' => '08123456789',
            'message' => 'Testimoni alumni',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/alumni/submissions/{$submission->id}");
        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('alumni_submissions', [
            'id' => $submission->id,
        ]);
    }

    public function test_user_can_update_password_and_token_is_revoked(): void
    {
        $admin = User::where('email', 'admin@mialahmad.sch.id')->first();
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/auth/update-password', [
                'current_password' => 'admin123',
                'new_password' => 'rahasiaBaru123',
                'new_password_confirmation' => 'rahasiaBaru123',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        // Tokens must be revoked
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_user_can_update_email_without_changing_password(): void
    {
        $admin = User::where('email', 'admin@mialahmad.sch.id')->first();
        $token = $admin->createToken('test-token')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/auth/update-password', [
                'current_password' => 'admin123',
                'new_email' => 'superadmin.updated@example.com',
            ])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('users', ['id' => $admin->id, 'email' => 'superadmin.updated@example.com']);
        $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $admin->id]);
    }

    public function test_superadmin_can_update_and_delete_admin_accounts(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();
        $admin = User::where('role', 'admin_humas')->first();

        $this->actingAs($superadmin, 'sanctum')
            ->putJson("/api/auth/users/{$admin->id}", [
                'name' => 'Humas Baru',
                'email' => 'humas.updated@example.com',
                'role' => 'admin_humas',
            ])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('users', ['id' => $admin->id, 'email' => 'humas.updated@example.com']);

        $this->actingAs($superadmin, 'sanctum')
            ->deleteJson("/api/auth/users/{$admin->id}")
            ->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $admin->id]);
    }

    public function test_superadmin_can_create_admin_account(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();

        $response = $this->actingAs($superadmin, 'sanctum')
            ->postJson('/api/auth/users', [
                'name' => 'Operator Baru',
                'email' => 'operator.baru@example.com',
                'role' => 'operator_ppdb',
                'phone' => '081234567890',
                'password' => 'passwordBaru123',
                'password_confirmation' => 'passwordBaru123',
            ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.role', 'operator_ppdb');

        $this->assertDatabaseHas('users', [
            'email' => 'operator.baru@example.com',
            'role' => 'operator_ppdb',
            'status' => 'active',
        ]);
    }

    public function test_non_superadmin_cannot_create_admin_account(): void
    {
        $admin = User::where('role', 'admin_humas')->first();

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/auth/users', [
                'name' => 'Operator Baru',
                'email' => 'operator.baru@example.com',
                'role' => 'operator_ppdb',
                'password' => 'passwordBaru123',
                'password_confirmation' => 'passwordBaru123',
            ])
            ->assertForbidden();

        $this->assertDatabaseMissing('users', ['email' => 'operator.baru@example.com']);
    }

    public function test_superadmin_cannot_create_another_superadmin(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();

        $this->actingAs($superadmin, 'sanctum')
            ->postJson('/api/auth/users', [
                'name' => 'Another Superadmin',
                'email' => 'another.superadmin@example.com',
                'role' => 'superadmin',
                'password' => 'passwordBaru123',
                'password_confirmation' => 'passwordBaru123',
            ])
            ->assertUnprocessable();

        $this->assertDatabaseMissing('users', ['email' => 'another.superadmin@example.com']);
    }

    public function test_superadmin_can_reset_another_user_password(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();
        $otherUser = User::where('role', '!=', 'superadmin')->first();
        $otherUser->createToken('active-token');

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($superadmin, 'sanctum')
            ->postJson("/api/auth/users/{$otherUser->id}/reset-password", [
                'new_password' => 'passwordBaruSuper123',
                'new_password_confirmation' => 'passwordBaruSuper123',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        // Target user's active session revoked
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $otherUser->id,
        ]);
    }

    public function test_superadmin_can_force_logout_user(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();
        $otherUser = User::where('role', '!=', 'superadmin')->first();
        $otherUser->createToken('victim-token');

        $response = $this->actingAs($superadmin, 'sanctum')
            ->postJson("/api/auth/users/{$otherUser->id}/force-logout");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $otherUser->id,
        ]);
    }
}
