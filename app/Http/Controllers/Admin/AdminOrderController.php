<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    /**
     * Daftar semua pesanan
     * Route: GET /admin/orders
     */
    public function index(Request $request): Response
    {
        $query = Order::with('user');

        if ($request->filled('status') && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->search}%")
                  ->orWhere('recipient_name', 'like', "%{$request->search}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$request->search}%"));
            });
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        // Format data untuk frontend
        $orders->getCollection()->transform(fn($order) => [
            'id'             => $order->id,
            'order_number'   => $order->order_number,
            'customer'       => $order->user?->name ?? $order->recipient_name,
            'recipient_name' => $order->recipient_name,
            'grand_total'    => $order->grand_total,
            'status'         => $order->status,
            'payment_method' => $order->payment_method,
            'payment_type'   => $order->payment_type,
            'paid_at'        => $order->paid_at?->translatedFormat('d M Y H:i'),
            'created_at'     => $order->created_at->translatedFormat('d M Y H:i'),
        ]);

        return Inertia::render('admin/AdminOrderList', [
            'orders'  => $orders,
            'filters' => $request->only(['search', 'status']),
            'statuses' => ['Semua', 'Menunggu', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'],
        ]);
    }

    /**
     * Detail satu pesanan
     * Route: GET /admin/orders/{id}
     */
    public function show(string $id): Response
    {
        $order = Order::with(['user', 'items'])->findOrFail($id);

        return Inertia::render('admin/AdminOrderDetail', [
            'order' => [
                'id'               => $order->id,
                'order_number'     => $order->order_number,
                'status'           => $order->status,
                'customer_name'    => $order->user?->name,
                'customer_email'   => $order->user?->email,
                'recipient_name'   => $order->recipient_name,
                'recipient_phone'  => $order->recipient_phone,
                'shipping_address' => $order->shipping_address,
                'payment_type'     => $order->payment_type,
                'payment_method'   => $order->payment_method,
                'payment_code'     => $order->payment_code,
                'subtotal'         => $order->subtotal,
                'shipping_cost'    => $order->shipping_cost,
                'tax'              => $order->tax,
                'grand_total'      => $order->grand_total,
                'notes'            => $order->notes,
                'paid_at'          => $order->paid_at?->translatedFormat('d M Y H:i'),
                'shipped_at'       => $order->shipped_at?->translatedFormat('d M Y H:i'),
                'completed_at'     => $order->completed_at?->translatedFormat('d M Y H:i'),
                'created_at'       => $order->created_at->translatedFormat('d M Y H:i'),
                'items'            => $order->items->map(fn($item) => [
                    'id'          => $item->id,
                    'book_title'  => $item->book_title,
                    'book_author' => $item->book_author,
                    'book_cover'  => $item->book_cover,
                    'quantity'    => $item->quantity,
                    'price'       => $item->price,
                    'subtotal'    => $item->subtotal,
                ]),
            ],
            'statuses' => ['Menunggu', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'],
        ]);
    }

    /**
     * Update status pesanan
     * Route: PATCH /admin/orders/{id}/status
     */
    public function updateStatus(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:Menunggu,Diproses,Dikirim,Selesai,Dibatalkan',
        ]);

        $order = Order::findOrFail($id);
        $oldStatus = $order->status;
        $newStatus = $request->status;

        $timestamps = [];
        if ($newStatus === 'Diproses' && !$order->paid_at) {
            $timestamps['paid_at'] = now();
        }
        if ($newStatus === 'Dikirim' && !$order->shipped_at) {
            $timestamps['shipped_at'] = now();
        }
        if ($newStatus === 'Selesai' && !$order->completed_at) {
            $timestamps['completed_at'] = now();
        }

        $order->update(array_merge(['status' => $newStatus], $timestamps));

        return back()->with('success', "Status pesanan {$order->order_number} diubah dari {$oldStatus} ke {$newStatus}.");
    }
}