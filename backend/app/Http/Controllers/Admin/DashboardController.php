<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\AlumniSubmission;
use App\Models\Article;
use App\Models\PpdbRegistration;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $stats = [
            'total_articles' => Article::count(),
            'total_achievements' => Achievement::count(),
            'total_teachers' => Teacher::count(),
            'total_ppdb' => PpdbRegistration::count(),
            'pending_ppdb' => PpdbRegistration::where('status', 'menunggu_verifikasi')->count(),
            'pending_alumni' => AlumniSubmission::where('status', 'pending')->count(),
            'total_admins' => User::where('role', 'admin')->orWhere('role', 'superadmin')->count(),
        ];

        $recentPpdb = PpdbRegistration::orderBy('id', 'desc')->limit(5)->get();
        $recentAlumni = AlumniSubmission::orderBy('id', 'desc')->limit(5)->get();
        $recentArticles = Article::orderBy('id', 'desc')->limit(5)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_ppdb' => $recentPpdb,
                'recent_alumni' => $recentAlumni,
                'recent_articles' => $recentArticles,
            ],
        ]);
    }
}
