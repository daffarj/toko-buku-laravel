<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class AdminBookController extends Controller
{
    /**
     * Dashboard admin (AdminDashboard)
     * Route: GET /admin
     */
    public function dashboard(): Response
    {
        $totalBooks   = Book::count();
        $totalOrders  = Order::count();
        $totalRevenue = Order::whereIn('status', ['Diproses', 'Dikirim', 'Selesai'])
            ->sum('grand_total');
        $todayRevenue = Order::whereIn('status', ['Diproses', 'Dikirim', 'Selesai'])
            ->whereDate('created_at', today())
            ->sum('grand_total');
        $totalUsers   = User::where('role', 'customer')->count();

        $recentOrders = Order::with('user:id,name')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($o) => [
                'id'       => $o->order_number,
                'customer' => $o->user?->name ?? $o->recipient_name,
                'total'    => $o->grand_total,
                'status'   => $o->status,
                'date'     => $o->created_at->translatedFormat('d M Y'),
            ]);

        return Inertia::render('admin/AdminDashboard', [
            'metrics' => [
                'totalBooks'   => $totalBooks,
                'totalOrders'  => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'todayRevenue' => $todayRevenue,
                'totalUsers'   => $totalUsers,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }

    /**
     * Daftar semua produk admin (AdminProductList)
     * Route: GET /admin/products
     */
    public function index(Request $request): Response
    {
        $query = Book::withTrashed(); // Tampilkan juga yang sudah dihapus (soft delete)

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('author', 'like', "%{$request->search}%")
                  ->orWhere('isbn', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $books = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $categories = Book::distinct()->orderBy('category')->pluck('category');

        return Inertia::render('admin/AdminProductList', [
            'books'      => $books,
            'categories' => $categories,
            'filters'    => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Form tambah produk (AddProduct)
     * Route: GET /admin/products/add
     */
    public function create(): Response
    {
        return Inertia::render('admin/AddProduct', [
            'categories' => ['Fiksi', 'Non-Fiksi', 'Edukasi', 'Komik', 'Biografi'],
        ]);
    }

    /**
     * Simpan produk baru
     * Route: POST /admin/products
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'author'         => 'required|string|max:255',
            'category'       => 'required|string|max:100',
            'price'          => 'required|integer|min:0',
            'original_price' => 'nullable|integer|min:0',
            'stock'          => 'required|integer|min:0',
            'isbn'           => 'nullable|string|max:20|unique:books,isbn',
            'publisher'      => 'nullable|string|max:255',
            'year'           => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'pages'          => 'nullable|integer|min:1',
            'language'       => 'nullable|string|max:50',
            'description'    => 'nullable|string|max:255',
            'synopsis'       => 'nullable|string',
            'cover'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'in_stock'       => 'boolean',
        ]);

        // Upload cover jika ada
        if ($request->hasFile('cover')) {
            $validated['cover'] = $request->file('cover')->store('books/covers', 'public');
            $validated['cover'] = Storage::url($validated['cover']);
        }

        Book::create($validated);

        return redirect()->route('admin.products')
            ->with('success', "Produk \"{$validated['title']}\" berhasil ditambahkan.");
    }

    /**
     * Form edit produk (EditProduct)
     * Route: GET /admin/products/edit/{id}
     */
    public function edit(string $id): Response
    {
        $book = Book::findOrFail($id);

        return Inertia::render('admin/EditProduct', [
            'book'       => $book,
            'categories' => ['Fiksi', 'Non-Fiksi', 'Edukasi', 'Komik', 'Biografi'],
        ]);
    }

    /**
     * Update produk
     * Route: PUT /admin/products/{id}
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $book = Book::findOrFail($id);

        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'author'         => 'required|string|max:255',
            'category'       => 'required|string|max:100',
            'price'          => 'required|integer|min:0',
            'original_price' => 'nullable|integer|min:0',
            'stock'          => 'required|integer|min:0',
            'isbn'           => 'nullable|string|max:20|unique:books,isbn,' . $id,
            'publisher'      => 'nullable|string|max:255',
            'year'           => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'pages'          => 'nullable|integer|min:1',
            'language'       => 'nullable|string|max:50',
            'description'    => 'nullable|string|max:255',
            'synopsis'       => 'nullable|string',
            'cover'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'in_stock'       => 'boolean',
        ]);

        // Upload cover baru jika ada
        if ($request->hasFile('cover')) {
            $validated['cover'] = $request->file('cover')->store('books/covers', 'public');
            $validated['cover'] = Storage::url($validated['cover']);
        }

        $book->update($validated);

        return redirect()->route('admin.products')
            ->with('success', "Produk \"{$book->title}\" berhasil diperbarui.");
    }

    /**
     * Hapus produk (soft delete)
     * Route: DELETE /admin/products/{id}
     */
    public function destroy(string $id): RedirectResponse
    {
        $book = Book::findOrFail($id);
        $title = $book->title;
        $book->delete(); // Soft delete — data tetap ada di DB

        return redirect()->route('admin.products')
            ->with('success', "Produk \"{$title}\" berhasil dihapus.");
    }
}