<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    /**
     * Halaman daftar produk (ProductList)
     * Route: GET /
     */
    public function index(Request $request): Response
    {
        $query = Book::query();

        // Filter kategori
        if ($request->filled('category') && $request->category !== 'Semua') {
            $query->where('category', $request->category);
        }

        // Filter pencarian dari Navbar
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('author', 'like', "%{$request->search}%");
            });
        }

        $books = $query->orderBy('rating', 'desc')->paginate(8)->withQueryString();

        // Ambil daftar kategori unik dari database
        $categories = array_merge(
            ['Semua'],
            Book::distinct()->orderBy('category')->pluck('category')->toArray()
        );

        return Inertia::render('ProductList', [
            'books'      => $books,
            'categories' => $categories,
            'filters'    => $request->only(['category', 'search']),
        ]);
    }

    /**
     * Halaman detail produk (ProductDetail)
     * Route: GET /product/{id}
     */
    public function show(string $id): Response
    {
        $book = Book::findOrFail($id);

        // Ambil buku rekomendasi dari kategori yang sama
        $related = Book::where('category', $book->category)
            ->where('id', '!=', $book->id)
            ->where('in_stock', true)
            ->orderBy('rating', 'desc')
            ->limit(4)
            ->get();

        // Ambil ulasan yang sudah approved
        $reviews = $book->reviews()
            ->with('user:id,name')
            ->where('status', 'approved')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($r) => [
                'id'      => $r->id,
                'name'    => $r->user->name,
                'rating'  => $r->rating,
                'date'    => $r->created_at->translatedFormat('d M Y'),
                'comment' => $r->body,
            ]);

        return Inertia::render('ProductDetail', [
            'book'    => $book,
            'related' => $related,
            'reviews' => $reviews,
        ]);
    }
}