<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Halaman pilih metode pembayaran (PaymentMethod)
     * Route: GET /payment
     */
    public function payment(): Response
    {
        $cart      = session('cart', []);
        $cartItems = array_values($cart);

        // Redirect ke cart jika kosong
        if (empty($cartItems)) {
            return Inertia::render('Cart', [
                'cartItems' => [],
                'cartTotal' => 0,
            ]);
        }

        $cartTotal  = collect($cartItems)->sum(fn($i) => $i['book']['price'] * $i['quantity']);
        $shipping   = 15000;
        $tax        = (int) round($cartTotal * 0.11);
        $grandTotal = $cartTotal + $shipping + $tax;

        return Inertia::render('PaymentMethod', [
            'cartItems'  => $cartItems,
            'cartTotal'  => $cartTotal,
            'shipping'   => $shipping,
            'tax'        => $tax,
            'grandTotal' => $grandTotal,
        ]);
    }

    /**
     * Proses konfirmasi pembayaran & buat order
     * Route: POST /payment/confirm
     */
    public function confirm(Request $request): RedirectResponse
    {
        $request->validate([
            'payment_type'    => 'required|in:bank,ewallet,card',
            'payment_method'  => 'required|string|max:30',
            'shipping_address'=> 'required|string',
            'recipient_name'  => 'required|string|max:100',
            'recipient_phone' => 'required|string|max:20',
        ]);

        $cart = session('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart');
        }

        $cartItems  = array_values($cart);
        $subtotal   = collect($cartItems)->sum(fn($i) => $i['book']['price'] * $i['quantity']);
        $shipping   = 15000;
        $tax        = (int) round($subtotal * 0.11);
        $grandTotal = $subtotal + $shipping + $tax;

        DB::transaction(function () use ($request, $cartItems, $subtotal, $shipping, $tax, $grandTotal) {
            $order = Order::create([
                'user_id'          => auth()->id(),
                'status'           => 'Menunggu',
                'shipping_address' => $request->shipping_address,
                'recipient_name'   => $request->recipient_name,
                'recipient_phone'  => $request->recipient_phone,
                'payment_type'     => $request->payment_type,
                'payment_method'   => $request->payment_method,
                'payment_code'     => null,   // akan diisi DokuController setelah VA berhasil dibuat
                'subtotal'         => $subtotal,
                'shipping_cost'    => $shipping,
                'tax'              => $tax,
                'grand_total'      => $grandTotal,
            ]);

            foreach ($cartItems as $item) {
                $book = Book::find($item['book']['id']);

                OrderItem::create([
                    'order_id'       => $order->id,
                    'book_id'        => $item['book']['id'],
                    'quantity'       => $item['quantity'],
                    'price'          => $item['book']['price'],
                    'original_price' => $item['book']['originalPrice'] ?? null,
                    'subtotal'       => $item['book']['price'] * $item['quantity'],
                    'book_title'     => $item['book']['title'],
                    'book_author'    => $item['book']['author'],
                    'book_cover'     => $item['book']['cover'],
                ]);

                // Kurangi stok buku
                if ($book) {
                    $book->decrement('stock', $item['quantity']);
                }
            }

            // Simpan order number ke session untuk halaman selanjutnya
            session(['current_order_number' => $order->order_number]);
            session(['current_order_id'     => $order->id]);
        });

        // Kosongkan cart setelah order dibuat
        session()->forget('cart');

        return redirect()->route('payment.code');
    }

    /**
     * Halaman kode pembayaran (PaymentCode)
     * Route: GET /payment/code
     */
    public function code(): Response
    {
        $orderId = session('current_order_id');
        $order   = $orderId ? Order::with('items')->find($orderId) : null;

        return Inertia::render('PaymentCode', [
            'order'       => $order,
            'orderNumber' => session('current_order_number', '#TK-20260001'),
        ]);
    }

    /**
     * Tandai pembayaran sukses (simulasi)
     * Route: POST /payment/verify
     */
    public function verify(Request $request): RedirectResponse
    {
        $orderId = session('current_order_id');

        if ($orderId) {
            $order = Order::find($orderId);
            if ($order && $order->status === 'Menunggu') {
                $order->update([
                    'status'  => 'Diproses',
                    'paid_at' => now(),
                ]);
            }
        }

        // Simulasi: 90% sukses, 10% gagal
        if (rand(1, 10) <= 9) {
            return redirect()->route('payment.success');
        }

        return redirect()->route('payment.failed');
    }

    /**
     * Halaman pembayaran sukses (PaymentSuccess)
     * Route: GET /payment/success
     */
    public function success(): Response
    {
        $orderId = session('current_order_id');
        $order   = $orderId ? Order::with('items')->find($orderId) : null;

        return Inertia::render('PaymentSuccess', [
            'order'         => $order,
            'orderNumber'   => session('current_order_number', '#TK-20260001'),
            'transactionId' => 'TXN-' . now()->format('Ymd') . '-' . rand(1000, 9999),
            'timestamp'     => now()->translatedFormat('d F Y, H:i:s'),
        ]);
    }

    /**
     * Halaman pembayaran gagal (PaymentFailed)
     * Route: GET /payment/failed
     */
    public function failed(): Response
    {
        return Inertia::render('PaymentFailed', [
            'orderNumber' => session('current_order_number'),
        ]);
    }

    /**
     * Konfirmasi pesanan setelah pembayaran (OrderConfirmation)
     * Route: GET /order-confirmation
     */
    public function confirmation(): Response
    {
        $orderId = session('current_order_id');
        $order   = $orderId
            ? Order::with('items')->find($orderId)
            : null;

        return Inertia::render('OrderConfirmation', [
            'order'       => $order,
            'orderNumber' => session('current_order_number', '#TK-20260001'),
        ]);
    }


}