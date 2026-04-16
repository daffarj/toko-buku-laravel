<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Halaman keranjang belanja (Cart)
     * Route: GET /cart
     */
    public function index(): Response
    {
        $cartItems = $this->getCart();

        $cartTotal = collect($cartItems)->sum(fn($item) => $item['book']['price'] * $item['quantity']);

        return Inertia::render('Cart', [
            'cartItems' => array_values($cartItems),
            'cartTotal' => $cartTotal,
        ]);
    }

    /**
     * Tambah buku ke keranjang
     * Route: POST /cart/add
     */
    public function add(Request $request): RedirectResponse
    {
        $request->validate([
            'book_id'  => 'required|exists:books,id',
            'quantity' => 'integer|min:1|max:99',
        ]);

        $book     = Book::findOrFail($request->book_id);
        $quantity = $request->quantity ?? 1;
        $cart     = $this->getCart();

        if (isset($cart[$book->id])) {
            $cart[$book->id]['quantity'] += $quantity;
        } else {
            $cart[$book->id] = [
                'book' => [
                    'id'            => (string) $book->id,
                    'title'         => $book->title,
                    'author'        => $book->author,
                    'category'      => $book->category,
                    'price'         => $book->price,
                    'originalPrice' => $book->original_price,
                    'rating'        => $book->rating,
                    'reviewCount'   => $book->review_count,
                    'cover'         => $book->cover,
                    'inStock'       => $book->in_stock,
                    'stock'         => $book->stock,
                    'isbn'          => $book->isbn,
                    'publisher'     => $book->publisher,
                    'year'          => $book->year,
                    'pages'         => $book->pages,
                    'language'      => $book->language,
                    'description'   => $book->description,
                    'synopsis'      => $book->synopsis,
                ],
                'quantity' => $quantity,
            ];
        }

        session(['cart' => $cart]);

        return back()->with('success', "\"{$book->title}\" ditambahkan ke keranjang.");
    }

    /**
     * Update jumlah item di keranjang
     * Route: PATCH /cart/{bookId}
     */
    public function update(Request $request, string $bookId): RedirectResponse
    {
        $request->validate(['quantity' => 'required|integer|min:1|max:99']);

        $cart = $this->getCart();

        if (isset($cart[$bookId])) {
            $cart[$bookId]['quantity'] = $request->quantity;
            session(['cart' => $cart]);
        }

        return back();
    }

    /**
     * Hapus item dari keranjang
     * Route: DELETE /cart/{bookId}
     */
    public function remove(string $bookId): RedirectResponse
    {
        $cart = $this->getCart();
        unset($cart[$bookId]);
        session(['cart' => $cart]);

        return back()->with('success', 'Item dihapus dari keranjang.');
    }

    /**
     * Kosongkan seluruh keranjang
     * Route: DELETE /cart
     */
    public function clear(): RedirectResponse
    {
        session()->forget('cart');
        return back();
    }

    /**
     * Helper: ambil cart dari session
     */
    private function getCart(): array
    {
        return session('cart', []);
    }
}