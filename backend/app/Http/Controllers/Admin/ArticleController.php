<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Article::query();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where('title', 'like', "%{$search}%");
        }

        $articles = $query->orderBy('id', 'desc')->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $articles->items(),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'total' => $articles->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->has('imageUrl') && !$request->has('image_url')) {
            $request->merge(['image_url' => $request->input('imageUrl')]);
        }
        if ($request->has('authorRole') && !$request->has('author_role')) {
            $request->merge(['author_role' => $request->input('authorRole')]);
        }
        if ($request->has('isFeatured') && !$request->has('is_featured')) {
            $request->merge(['is_featured' => $request->input('isFeatured')]);
        }
        if ($request->has('readTime') && !$request->has('read_time')) {
            $request->merge(['read_time' => $request->input('readTime')]);
        }
        if ($request->has('sourceUrl') && !$request->has('source_url')) {
            $request->merge(['source_url' => $request->input('sourceUrl')]);
        }
        if ($request->has('sourceName') && !$request->has('source_name')) {
            $request->merge(['source_name' => $request->input('sourceName')]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:articles,slug',
            'category' => 'required|in:Kegiatan,Prestasi,Informasi,Edukasi',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'author' => 'nullable|string|max:100',
            'author_role' => 'nullable|string|max:100',
            'image_url' => 'nullable|string',
            'is_featured' => 'boolean',
            'read_time' => 'nullable|string|max:50',
            'source_url' => 'nullable|url',
            'source_name' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'status' => 'required|in:published,draft,archived',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::lower(Str::random(5));
        }

        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $article = Article::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil ditambahkan.',
            'data' => $article,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $article = Article::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);

        if ($request->has('imageUrl') && !$request->has('image_url')) {
            $request->merge(['image_url' => $request->input('imageUrl')]);
        }
        if ($request->has('authorRole') && !$request->has('author_role')) {
            $request->merge(['author_role' => $request->input('authorRole')]);
        }
        if ($request->has('isFeatured') && !$request->has('is_featured')) {
            $request->merge(['is_featured' => $request->input('isFeatured')]);
        }
        if ($request->has('readTime') && !$request->has('read_time')) {
            $request->merge(['read_time' => $request->input('readTime')]);
        }
        if ($request->has('sourceUrl') && !$request->has('source_url')) {
            $request->merge(['source_url' => $request->input('sourceUrl')]);
        }
        if ($request->has('sourceName') && !$request->has('source_name')) {
            $request->merge(['source_name' => $request->input('sourceName')]);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255|unique:articles,slug,' . $id,
            'category' => 'sometimes|required|in:Kegiatan,Prestasi,Informasi,Edukasi',
            'excerpt' => 'sometimes|required|string',
            'content' => 'sometimes|required|string',
            'author' => 'nullable|string|max:100',
            'author_role' => 'nullable|string|max:100',
            'image_url' => 'nullable|string',
            'is_featured' => 'boolean',
            'read_time' => 'nullable|string|max:50',
            'source_url' => 'nullable|url',
            'source_name' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'status' => 'sometimes|required|in:published,draft,archived',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'published' && !$article->published_at) {
            $validated['published_at'] = now();
        }

        $article->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil diperbarui.',
            'data' => $article,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil dihapus.',
        ]);
    }
}
