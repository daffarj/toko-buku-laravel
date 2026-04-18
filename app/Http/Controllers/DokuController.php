<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DokuController extends Controller
{
    private string $clientId;
    private string $secretKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->clientId  = config('doku.client_id');
        $this->secretKey = config('doku.secret_key');
        $this->baseUrl   = config('doku.base_url');
    }

    // ─────────────────────────────────────────────────────────
    // VIRTUAL ACCOUNT
    // ─────────────────────────────────────────────────────────

    /**
     * Buat Virtual Account DOKU
     * Route: POST /payment/doku/va/create
     */
    public function createVirtualAccount(Request $request): RedirectResponse
    {
        $orderId = session('current_order_id');
        if (!$orderId) return redirect()->route('cart');

        $order = Order::with('items')->findOrFail($orderId);

        // Map bank ke channel DOKU
        $channelMap = [
            'BCA'     => 'VIRTUAL_ACCOUNT_BCA',
            'Mandiri' => 'VIRTUAL_ACCOUNT_MANDIRI',
            'BNI'     => 'VIRTUAL_ACCOUNT_BNI',
            'BRI'     => 'VIRTUAL_ACCOUNT_BRI',
        ];

        $channel = $channelMap[$order->payment_method] ?? 'VIRTUAL_ACCOUNT_BCA';

        $requestId   = 'REQ-' . now()->format('YmdHis') . '-' . rand(1000, 9999);
        $requestDate = now()->format('Y-m-d\TH:i:s\Z');
        $expiredDate = now()->addHours(24)->format('Y-m-d\TH:i:s\Z');

        $body = [
            'order' => [
                'invoice_number' => $order->order_number,
                'line_items'     => $order->items->map(fn($item) => [
                    'name'     => $item->book_title,
                    'price'    => $item->price,
                    'quantity' => $item->quantity,
                ])->toArray(),
                'amount'         => $order->grand_total,
            ],
            'virtual_account_info' => [
                'billing_type'      => 'FIX_BILL',
                'expired_time'      => 24,
                'reusable_status'   => false,
                'info1'             => 'Toko Buku',
                'info2'             => $order->order_number,
                'info3'             => 'Terima kasih',
            ],
            'customer' => [
                'name'  => $order->recipient_name,
                'email' => $order->user?->email ?? 'customer@tokobuku.com',
                'phone' => $order->recipient_phone,
            ],
        ];

        $signature = $this->generateSignature('POST', '/checkout/v1/payment/virtual-account', $requestId, $requestDate, $body);

        try {
            $response = Http::withHeaders([
                'Client-Id'    => $this->clientId,
                'Request-Id'   => $requestId,
                'Request-Timestamp' => $requestDate,
                'Signature'    => $signature,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/checkout/v1/payment/virtual-account', $body);

            $data = $response->json();

            if ($response->successful() && isset($data['virtual_account_info']['virtual_account_number'])) {
                $vaNumber = $data['virtual_account_info']['virtual_account_number'];

                // Update payment_code di order
                $order->update(['payment_code' => $vaNumber]);

                return redirect()->route('payment.code');
            }

            Log::error('DOKU VA Error', ['response' => $data]);
            return redirect()->route('payment.code');

        } catch (\Exception $e) {
            Log::error('DOKU VA Exception', ['error' => $e->getMessage()]);
            return redirect()->route('payment.code');
        }
    }

    // ─────────────────────────────────────────────────────────
    // QRIS
    // ─────────────────────────────────────────────────────────

    /**
     * Buat QRIS DOKU
     * Route: POST /payment/doku/qris/create
     */
    public function createQris(Request $request): RedirectResponse
    {
        $orderId = session('current_order_id');
        if (!$orderId) return redirect()->route('cart');

        $order = Order::with('items')->findOrFail($orderId);

        $requestId   = 'REQ-' . now()->format('YmdHis') . '-' . rand(1000, 9999);
        $requestDate = now()->format('Y-m-d\TH:i:s\Z');

        $body = [
            'order' => [
                'invoice_number' => $order->order_number,
                'line_items'     => $order->items->map(fn($item) => [
                    'name'     => $item->book_title,
                    'price'    => $item->price,
                    'quantity' => $item->quantity,
                ])->toArray(),
                'amount'         => $order->grand_total,
                'callback_url'   => route('payment.doku.callback'),
            ],
            'customer' => [
                'name'  => $order->recipient_name,
                'email' => $order->user?->email ?? 'customer@tokobuku.com',
                'phone' => $order->recipient_phone,
            ],
        ];

        $signature = $this->generateSignature('POST', '/checkout/v1/payment/qris', $requestId, $requestDate, $body);

        try {
            $response = Http::withHeaders([
                'Client-Id'         => $this->clientId,
                'Request-Id'        => $requestId,
                'Request-Timestamp' => $requestDate,
                'Signature'         => $signature,
                'Content-Type'      => 'application/json',
            ])->post($this->baseUrl . '/checkout/v1/payment/qris', $body);

            $data = $response->json();

            if ($response->successful() && isset($data['qris']['qr_string'])) {
                // Simpan QR string ke session untuk ditampilkan
                session(['doku_qr_string' => $data['qris']['qr_string']]);
                session(['doku_qr_url'    => $data['qris']['qr_url'] ?? null]);

                return redirect()->route('payment.code');
            }

            Log::error('DOKU QRIS Error', ['response' => $data]);
            return redirect()->route('payment.code');

        } catch (\Exception $e) {
            Log::error('DOKU QRIS Exception', ['error' => $e->getMessage()]);
            return redirect()->route('payment.code');
        }
    }

    // ─────────────────────────────────────────────────────────
    // CALLBACK / WEBHOOK dari DOKU
    // ─────────────────────────────────────────────────────────

    /**
     * Terima notifikasi pembayaran dari DOKU
     * Route: POST /payment/doku/callback
     */
    public function callback(Request $request): JsonResponse
    {
        // Verifikasi signature dari DOKU
        $signature = $request->header('Signature');
        if (!$this->verifyCallback($request, $signature)) {
            Log::warning('DOKU Callback: invalid signature');
            return response()->json(['status' => 'FAILED'], 401);
        }

        $data = $request->all();
        Log::info('DOKU Callback received', $data);

        $invoiceNumber = $data['order']['invoice_number'] ?? null;
        $resultCode    = $data['transaction']['status'] ?? null;

        if (!$invoiceNumber) {
            return response()->json(['status' => 'FAILED'], 400);
        }

        $order = Order::where('order_number', $invoiceNumber)->first();

        if ($order && $resultCode === 'SUCCESS') {
            $order->update([
                'status'  => 'Diproses',
                'paid_at' => now(),
            ]);
            Log::info("Order {$invoiceNumber} berhasil dibayar via DOKU");
        }

        return response()->json(['status' => 'OK']);
    }

    // ─────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────

    /**
     * Generate DOKU Signature
     * Format: HMAC-SHA256("Client-Id:Request-Id:Request-Timestamp:lowercase(sha256(body))", secretKey)
     */
    private function generateSignature(string $method, string $path, string $requestId, string $requestDate, array $body): string
    {
        $bodyJson    = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $hashedBody  = strtolower(hash('sha256', $bodyJson));
        $digest      = "Client-Id:{$this->clientId}\nRequest-Id:{$requestId}\nRequest-Timestamp:{$requestDate}\nRequest-Target:{$path}\nDigest:{$hashedBody}";
        $signature   = base64_encode(hash_hmac('sha256', $digest, $this->secretKey, true));

        return "HMACSHA256={$signature}";
    }

    /**
     * Verifikasi signature callback dari DOKU
     */
    private function verifyCallback(Request $request, ?string $signature): bool
    {
        if (!$signature) return false;

        $requestId   = $request->header('Request-Id', '');
        $requestDate = $request->header('Request-Timestamp', '');
        $body        = $request->getContent();
        $hashedBody  = strtolower(hash('sha256', $body));

        $digest    = "Client-Id:{$this->clientId}\nRequest-Id:{$requestId}\nRequest-Timestamp:{$requestDate}\nRequest-Target:/payment/doku/callback\nDigest:{$hashedBody}";
        $expected  = 'HMACSHA256=' . base64_encode(hash_hmac('sha256', $digest, $this->secretKey, true));

        return hash_equals($expected, $signature);
    }
}