<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\AlumniProfile;
use App\Models\AlumniSubmission;
use App\Models\Announcement;
use App\Models\Article;
use App\Models\CalendarAgenda;
use App\Models\Facility;
use App\Models\MasterAcademicYear;
use App\Models\MasterAlumniCohort;
use App\Models\MasterCategory;
use App\Models\MasterPpdbPath;
use App\Models\PpdbRegistration;
use App\Models\SchoolProfile;
use App\Models\SiteSetting;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicApiController extends Controller
{
    public function profile(): JsonResponse
    {
        $profile = SchoolProfile::first();

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    public function settings(): JsonResponse
    {
        $settings = SiteSetting::all()->pluck('value', 'key')->toArray();
        $profile = SchoolProfile::first();

        if ($profile) {
            $defaults = [
                'school_name' => $profile->name,
                'school_tagline' => $profile->tagline,
                'school_accreditation' => $profile->accreditation,
                'school_npsn' => $profile->npsn,
                'school_phone' => $profile->phone,
                'school_whatsapp' => $profile->whatsapp,
                'school_email' => $profile->email,
                'school_address' => $profile->address,
                'maps_embed_url' => $profile->maps_embed_url,
                'school_logo_url' => $profile->logo_url ?: '/assets/logo-mi-al-ahmad.png',
                'hero_image_url' => $profile->hero_image_url ?: '/assets/gedung-mi-al-ahmad.jpg',
                'hero_students_image_url' => '/assets/hero-students.png',
                'principal_name' => $profile->principal_name,
                'principal_greeting' => $profile->principal_greeting,
                'principal_image_url' => $profile->principal_image_url ?: '/assets/principal.png',
                'vision_text' => $profile->vision,
                'vision_image_url' => '/assets/gedung-mi-al-ahmad.jpg',
                'social_instagram' => $profile->social_instagram,
                'social_facebook' => $profile->social_facebook,
                'social_youtube' => $profile->social_youtube,
                'social_tiktok' => $profile->social_tiktok,
            ];

            foreach ($defaults as $k => $v) {
                if ((!isset($settings[$k]) || trim((string)$settings[$k]) === '') && !empty($v)) {
                    $settings[$k] = (string) $v;
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function articles(Request $request): JsonResponse
    {
        $query = Article::published();

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('featured')) {
            $query->where('is_featured', filter_var($request->query('featured'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $articles = $query->orderBy('published_at', 'desc')->paginate($request->query('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $articles->items(),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
            ],
        ]);
    }

    public function articleDetail(string $slug): JsonResponse
    {
        $article = Article::published()->where('slug', $slug)->first();

        if (!$article) {
            // Fallback: try by ID if slug not found
            $article = Article::published()->where('id', $slug)->first();
        }

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel atau berita tidak ditemukan.',
            ], 404);
        }

        $article->increment('views_count');

        $related = Article::published()
            ->where('id', '!=', $article->id)
            ->where('category', $article->category)
            ->limit(3)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $article,
            'related' => $related,
        ]);
    }

    public function achievements(): JsonResponse
    {
        $achievements = Achievement::orderBy('year', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $achievements,
        ]);
    }

    public function teachers(): JsonResponse
    {
        $teachers = Teacher::where('is_active', true)
            ->orderBy('order', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $teachers,
        ]);
    }

    public function facilities(): JsonResponse
    {
        $facilities = Facility::orderBy('order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $facilities,
        ]);
    }

    public function alumni(): JsonResponse
    {
        $alumni = AlumniProfile::where('is_active', true)
            ->orderBy('order', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $alumni,
        ]);
    }

    public function submitAlumni(Request $request): JsonResponse
    {
        $data = [
            'full_name' => $request->input('full_name') ?? $request->input('fullName'),
            'graduation_year' => $request->input('graduation_year') ?? $request->input('graduationYear'),
            'job_role' => $request->input('job_role') ?? $request->input('jobRole'),
            'photo_url' => $request->input('photo_url') ?? $request->input('photoUrl'),
            'social_media' => $request->input('social_media') ?? $request->input('socialMedia'),
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'message' => $request->input('message'),
        ];

        $validator = \Illuminate\Support\Facades\Validator::make($data, [
            'full_name' => 'required|string|max:150',
            'graduation_year' => 'required|string|max:20',
            'job_role' => 'required|string|max:150',
            'photo_url' => 'nullable|string|max:500',
            'social_media' => 'nullable|string|max:200',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100',
            'message' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $cohort = MasterAlumniCohort::where('year', $data['graduation_year'])->first();

        $submission = AlumniSubmission::create([
            'cohort_id' => $cohort?->id,
            'full_name' => $data['full_name'],
            'graduation_year' => $data['graduation_year'],
            'job_role' => $data['job_role'],
            'photo_url' => $data['photo_url'],
            'social_media' => $data['social_media'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'message' => $data['message'],
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih! Data alumni Anda berhasil dikirim dan akan diverifikasi oleh admin madrasah.',
            'data' => [
                'id' => $submission->id,
                'status' => $submission->status,
            ],
        ], 201);
    }

    public function submitPpdb(Request $request): JsonResponse
    {
        $data = [
            'child_full_name' => $request->input('child_full_name') ?? $request->input('childFullName'),
            'gender' => $request->input('gender'),
            'birth_place' => $request->input('birth_place') ?? $request->input('birthPlace'),
            'birth_date' => $request->input('birth_date') ?? $request->input('birthDate'),
            'parent_name' => $request->input('parent_name') ?? $request->input('parentName'),
            'whatsapp' => $request->input('whatsapp'),
            'address' => $request->input('address'),
            'previous_school' => $request->input('previous_school') ?? $request->input('previousSchool'),
        ];

        $validator = \Illuminate\Support\Facades\Validator::make($data, [
            'child_full_name' => 'required|string|max:150',
            'gender' => 'required|in:Laki-laki,Perempuan',
            'birth_place' => 'required|string|max:100',
            'birth_date' => 'required|date',
            'parent_name' => 'required|string|max:150',
            'whatsapp' => 'required|string|max:30',
            'address' => 'required|string|max:500',
            'previous_school' => 'nullable|string|max:150',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $activeYear = MasterAcademicYear::where('is_active', true)->first();
        $defaultPath = MasterPpdbPath::where('is_active', true)->orderBy('order', 'asc')->first();

        $registration = PpdbRegistration::create([
            'academic_year_id' => $activeYear?->id,
            'ppdb_path_id' => $defaultPath?->id,
            'child_full_name' => $data['child_full_name'],
            'gender' => $data['gender'],
            'birth_place' => $data['birth_place'],
            'birth_date' => $data['birth_date'],
            'parent_name' => $data['parent_name'],
            'whatsapp' => $data['whatsapp'],
            'address' => $data['address'],
            'previous_school' => $data['previous_school'],
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran PPDB berhasil diajukan.',
            'registration_number' => $registration->registration_number,
            'data' => [
                'registration_number' => $registration->registration_number,
                'child_full_name' => $registration->child_full_name,
                'status' => $registration->status,
                'registered_at' => $registration->registered_at,
            ],
        ], 201);
    }

    public function announcements(): JsonResponse
    {
        $announcements = Announcement::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $announcements,
        ]);
    }

    public function agendas(): JsonResponse
    {
        $agendas = CalendarAgenda::orderBy('order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $agendas,
        ]);
    }
}
