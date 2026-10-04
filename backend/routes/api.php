<?php

use App\Http\Controllers\Admin\AchievementController as AdminAchievementController;
use App\Http\Controllers\Admin\AlumniController as AdminAlumniController;
use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\FacilityController as AdminFacilityController;
use App\Http\Controllers\Admin\MasterDataController as AdminMasterDataController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Admin\PpdbController as AdminPpdbController;
use App\Http\Controllers\Admin\SchoolProfileController as AdminSchoolProfileController;
use App\Http\Controllers\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Admin\TeacherController as AdminTeacherController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Institutional API Routes (Web Visitors & Forms)
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {
    Route::get('/profile', [PublicApiController::class, 'profile']);
    Route::get('/settings', [PublicApiController::class, 'settings']);
    Route::get('/articles', [PublicApiController::class, 'articles']);
    Route::get('/articles/{slug}', [PublicApiController::class, 'articleDetail']);
    Route::get('/achievements', [PublicApiController::class, 'achievements']);
    Route::get('/teachers', [PublicApiController::class, 'teachers']);
    Route::get('/facilities', [PublicApiController::class, 'facilities']);
    Route::get('/alumni', [PublicApiController::class, 'alumni']);
    Route::get('/announcements', [PublicApiController::class, 'announcements']);
    Route::get('/agendas', [PublicApiController::class, 'agendas']);

    // Public Form Submissions (Rate Limited)
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/alumni/submit', [PublicApiController::class, 'submitAlumni']);
        Route::post('/ppdb/register', [PublicApiController::class, 'submitPpdb']);
    });
});

/*
|--------------------------------------------------------------------------
| Authentication Routes (Strict Brute-Force Throttle)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/update-password', [AuthController::class, 'updatePassword']);
    });
});

/*
|--------------------------------------------------------------------------
| Protected Admin Dashboard API Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Overview Dashboard Statistics
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);

    // Page Section Visibility & Appearance Settings
    Route::get('/settings', [AdminSiteSettingController::class, 'index']);
    Route::post('/settings', [AdminSiteSettingController::class, 'batchUpdate']);

    // School Profile Information
    Route::get('/school-profile', [AdminSchoolProfileController::class, 'show']);
    Route::put('/school-profile', [AdminSchoolProfileController::class, 'update']);

    // Articles & News Management
    Route::apiResource('articles', AdminArticleController::class);

    // Achievements Management
    Route::apiResource('achievements', AdminAchievementController::class);

    // Teachers & Staff Management
    Route::apiResource('teachers', AdminTeacherController::class);

    // Facilities Management
    Route::apiResource('facilities', AdminFacilityController::class);

    // Alumni Management & Moderation
    Route::get('/alumni/submissions', [AdminAlumniController::class, 'submissions']);
    Route::patch('/alumni/submissions/{id}/status', [AdminAlumniController::class, 'updateSubmissionStatus']);
    Route::delete('/alumni/submissions/{id}', [AdminAlumniController::class, 'destroySubmission']);
    Route::get('/alumni/profiles', [AdminAlumniController::class, 'profiles']);
    Route::post('/alumni/profiles', [AdminAlumniController::class, 'storeProfile']);
    Route::put('/alumni/profiles/{id}', [AdminAlumniController::class, 'updateProfile']);
    Route::delete('/alumni/profiles/{id}', [AdminAlumniController::class, 'destroyProfile']);

    // PPDB Admissions Management
    Route::get('/ppdb', [AdminPpdbController::class, 'index']);
    Route::get('/ppdb/registrations', [AdminPpdbController::class, 'index']);
    Route::get('/ppdb/registrations/{id}', [AdminPpdbController::class, 'show']);
    Route::patch('/ppdb/registrations/{id}/status', [AdminPpdbController::class, 'updateStatus']);
    Route::delete('/ppdb/registrations/{id}', [AdminPpdbController::class, 'destroy']);
    Route::patch('/ppdb/{id}/status', [AdminPpdbController::class, 'updateStatus']);
    Route::delete('/ppdb/{id}', [AdminPpdbController::class, 'destroy']);

    // Master Database Management
    Route::get('/master-data', [AdminMasterDataController::class, 'index']);
    Route::post('/master-data/categories', [AdminMasterDataController::class, 'storeCategory']);
    Route::put('/master-data/ppdb-paths/{id}', [AdminMasterDataController::class, 'updatePpdbPath']);
    Route::post('/master-data/academic-years/{id}/set-active', [AdminMasterDataController::class, 'setActiveAcademicYear']);

    // Media & File Upload (Stored on Disk/Storage, NOT as raw BLOB in DB)
    Route::post('/media/upload', [AdminMediaController::class, 'upload']);
});
