<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminBookController extends Controller
{
    /**
     * Dashboard Admin
     * Route: GET /admin
     */
    public function dashboard(): Response
    {
        $metrics = [
            'totalBooks'    => Book::count(),
            'totalOrders'   => Order::count(),
            'totalRevenue'  => Order::where('status', 'Selesai')->sum('grand_total'),
            'todayRevenue'  => Order::whereDate('created_at', today())
                                    ->whereIn('status', ['Diproses', 'Dikirim', 'Selesai'])
                                    ->sum('grand_total'),
            'totalUsers'    => User::count(),
        ];

        $recentOrders = Order::with('user')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($order) => [
                'id'       => $order->order_number,
                'customer' => $order->user?->name ?? $order->recipient_name,
                'total'    => $order->grand_total,
                'status'   => $order->status,
                'date'     => $order->created_at->translatedFormat('d M Y'),
            ]);

        return Inertia::render('admin/AdminDashboard', [
            'metrics'      => $metrics,
            'recentOrders' => $recentOrders,
        ]);
    }

    /**
     * Daftar semua produk (dengan filter & pagination)
     * Route: GET /admin/products
     */
    public function index(Request $request): Response
    {
        $query = Book::withTrashed(); // Tampilkan juga yang soft-deleted

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('author', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'Semua') {
            $query->where('category', $request->category);
        }

        $books = $query->latest()->paginate(10)->withQueryString();

        $categories = Book::distinct()->orderBy('category')->pluck('category')->toArray();

        return Inertia::render('admin/AdminProductList', [
            'books'      => $books,
            'categories' => $categories,
            'filters'    => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Form tambah produk baru
     * Route: GET /admin/products/add
     */
    public function create(): Response
    {
        $categories = Book::distinct()->orderBy('category')->pluck('category')->toArray();

        // Jika belum ada kategori di DB, pakai default
        if (empty($categories)) {
            $categories = ['Fiksi', 'Non-Fiksi', 'Edukasi', 'Komik', 'Biografi'];
        }

        return Inertia::render('admin/AddProduct', [
            'categories' => $categories,
        ]);
    }

    /**
     * Simpan produk baru ke database
     * Route: POST /admin/products
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'author'      => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'publisher'   => 'required|string|max:255',
            'year'        => 'required|integer|min:1900|max:2030',
            'isbn'        => 'nullable|string|max:20|unique:books,isbn',
            'pages'       => 'nullable|integer|min:1',
            'language'    => 'nullable|string|max:50',
            'description' => 'nullable|string|max:255',
            'synopsis'    => 'nullable|string',
            'in_stock'    => 'boolean',
            'cover'       => 'nullable|image|max:2048',
        ]);

        // Upload cover jika ada
        if ($request->hasFile('cover')) {
            $validated['cover'] = $request->file('cover')->store('covers', 'public');
            $validated['cover'] = Storage::url($validated['cover']);
        }

        $validated['in_stock'] = $request->boolean('in_stock', true);

        Book::create($validated);

        return redirect()->route('admin.products')
            ->with('success', "Produk \"{$validated['title']}\" berhasil ditambahkan.");
    }

    /**
     * Form edit produk
     * Route: GET /admin/products/edit/{id}
     */
    public function edit(string $id): Response
    {
        $book       = Book::withTrashed()->findOrFail($id);
        $categories = Book::distinct()->orderBy('category')->pluck('category')->toArray();

        if (empty($categories)) {
            $categories = ['Fiksi', 'Non-Fiksi', 'Edukasi', 'Komik', 'Biografi'];
        }

        return Inertia::render('admin/EditProduct', [
            'book'       => $book,
            'categories' => $categories,
        ]);
    }

    /**
     * Update produk di database
     * Route: PUT /admin/products/{id}
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $book = Book::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'author'      => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'publisher'   => 'required|string|max:255',
            'year'        => 'required|integer|min:1900|max:2030',
            'isbn'        => "nullable|string|max:20|unique:books,isbn,{$book->id}",
            'pages'       => 'nullable|integer|min:1',
            'language'    => 'nullable|string|max:50',
            'description' => 'nullable|string|max:255',
            'synopsis'    => 'nullable|string',
            'in_stock'    => 'boolean',
            'cover'       => 'nullable|image|max:2048',
        ]);

        // Ganti cover jika ada upload baru
        if ($request->hasFile('cover')) {
            // Hapus cover lama jika tersimpan di storage lokal
            if ($book->cover && str_starts_with($book->cover, '/storage/')) {
                $oldPath = str_replace('/storage/', 'public/', $book->cover);
                Storage::delete($oldPath);
            }
            $validated['cover'] = Storage::url(
                $request->file('cover')->store('covers', 'public')
            );
        } else {
            // Pertahankan cover lama
            unset($validated['cover']);
        }

        $validated['in_stock'] = $request->boolean('in_stock', true);

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