<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

// ── DOKU PHP SDK ──────────────────────────────────────────────
use Doku\Snap\Snap;
use Doku\Snap\Models\VA\Request\CreateVaRequestDto;
use Doku\Snap\Models\TotalAmount\TotalAmount;
use Doku\Snap\Models\VA\AdditionalInfo\CreateVaRequestAdditionalInfo;
use Doku\Snap\Models\VA\VirtualAccountConfig\CreateVaVirtualAccountConfig;

class DokuController extends Controller
{
    // ─────────────────────────────────────────────────────────
    // Channel map: payment_method di Order → channel DOKU SNAP
    // Catatan: di sandbox, channel yang aktif bergantung pada
    // bank apa yang diaktifkan di DOKU Dashboard kamu.
    // Default pakai CIMB karena paling umum di sandbox baru.
    // Ganti nilai ini sesuai bank yang aktif di akunmu.
    // ─────────────────────────────────────────────────────────
    // Konfigurasi per bank dari DOKU Dashboard → Settings → Virtual Account SNAP → Configure
    // partner_service_id : kolom "Partner Service ID"
    // customer_prefix    : kolom "Prefix Customer No" — customerNo harus diawali angka ini
    private const BANK_CONFIG = [
        'BCA'     => ['channel' => 'VIRTUAL_ACCOUNT_BCA',          'partner_service_id' => '19008', 'customer_prefix' => '9'],
        'Mandiri' => ['channel' => 'VIRTUAL_ACCOUNT_BANK_MANDIRI',  'partner_service_id' => '86188', 'customer_prefix' => '0'],
        'BNI'     => ['channel' => 'VIRTUAL_ACCOUNT_BNI',           'partner_service_id' => '8492',  'customer_prefix' => '3'],
        'BRI'     => ['channel' => 'VIRTUAL_ACCOUNT_BRI',           'partner_service_id' => '13925', 'customer_prefix' => '6'],
    ];

    // ─────────────────────────────────────────────────────────
    // Bangun instance Snap SDK dari config/.env
    // ─────────────────────────────────────────────────────────
    private function makeSnap(): Snap
    {
        $path = config('doku.private_key_path');

        // Support path relatif dari root project maupun storage/
        if (!str_starts_with($path, '/')) {
            $path = base_path($path);
        }

        if (!file_exists($path)) {
            throw new \RuntimeException(
                "Private key tidak ditemukan: {$path}\n" .
                "Set DOKU_PRIVATE_KEY_PATH di .env (contoh: storage/app/doku-private.key)"
            );
        }

        $privateKey = file_get_contents($path);

        // Constructor Snap SDK v1.x — positional (tidak support named parameters):
        // new Snap($privateKey, $publicKey, $dokuPublicKey, $clientId, $issuer, $isProduction, $secretKey, $authCode)
        return new Snap(
            $privateKey,                                // privateKey
            '',                                         // publicKey
            '',                                         // dokuPublicKey
            config('doku.client_id'),                   // clientId
            '',                                         // issuer
            (bool) config('doku.is_production', false), // isProduction
            config('doku.secret_key'),                  // secretKey
            ''                                          // authCode
        );
    }

    // ─────────────────────────────────────────────────────────
    // VIRTUAL ACCOUNT
    // Route: POST /payment/doku/va/create
    // Dipanggil dari PaymentMethod.tsx setelah order dibuat
    // ─────────────────────────────────────────────────────────
    public function createVirtualAccount(Request $request): RedirectResponse
    {
        $orderId = session('current_order_id');

        if (!$orderId) {
            Log::warning('DOKU VA: session current_order_id kosong, redirect ke cart');
            return redirect()->route('cart');
        }

        /** @var Order $order */
        $order = Order::with('user')->findOrFail($orderId);

        // Jika VA sudah ada dan bukan placeholder, langsung lanjut
        if ($order->payment_code && !str_starts_with((string) $order->payment_code, 'PENDING-')) {
            Log::info('DOKU VA: order sudah punya VA, skip createVA', ['order' => $order->order_number]);
            return redirect()->route('payment.code');
        }

        try {
            $snap = $this->makeSnap();

            // ── Susun parameter DTO ───────────────────────────────

            // Ambil konfigurasi bank berdasarkan payment_method order
            $bankConfig       = self::BANK_CONFIG[$order->payment_method] ?? self::BANK_CONFIG['BCA'];
            $channel          = $bankConfig['channel'];
            $rawServiceId     = $bankConfig['partner_service_id'];

            // partnerServiceId: WAJIB 8 karakter, left-pad spasi
            // Contoh: "19008" → "   19008", "86188" → "   86188"
            $partnerServiceId = str_pad($rawServiceId, 8, ' ', STR_PAD_LEFT);

            // customerNo: diawali dengan Prefix Customer No dari dashboard, diikuti order ID
            // Contoh BCA prefix=9: "9" + "21" = "921"
            $customerPrefix = $bankConfig['customer_prefix'];
            $customerNo     = $customerPrefix . $order->id;

            // virtualAccountNo = partnerServiceId (8 char) + customerNo
            $virtualAccountNo = $partnerServiceId . $customerNo;

            // trxId: invoice number unik, tambahkan timestamp agar tidak tabrakan di retry
            // Hapus # dan spasi karena DOKU tidak terima karakter itu
            $orderClean = str_replace(['#', ' '], '', $order->order_number);
            $trxId      = $orderClean . '-' . time();

            // Nama VA: maks 20 karakter
            $vaName = substr($order->recipient_name, 0, 20);

            // Email customer
            $email  = $order->user?->email ?? 'customer@tokobuku.com';

            // Phone: format 62xxx, hanya digit, maks 30 karakter
            $rawPhone = preg_replace('/\D/', '', $order->recipient_phone);
            $phone    = str_starts_with($rawPhone, '0')
                      ? '62' . substr($rawPhone, 1)
                      : $rawPhone;
            $phone    = substr($phone, 0, 30);

            // Amount: format "xxxxxx.00" sesuai standar ISO 4217 DOKU
            $amount = number_format((float) $order->grand_total, 2, '.', '');



            // Expired 24 jam, format ISO-8601 dengan timezone +07:00
            $expiredDate = now('Asia/Jakarta')->addHours(24)->format('Y-m-d\TH:i:sP');

            // ── Build DTO — positional (SDK v1.x tidak support named parameters) ──
            $dto = new CreateVaRequestDto(
                $partnerServiceId,                              // partnerServiceId
                $customerNo,                                    // customerNo
                $virtualAccountNo,                              // virtualAccountNo
                $vaName,                                        // virtualAccountName
                $email,                                         // virtualAccountEmail
                $phone,                                         // virtualAccountPhone
                $trxId,                                         // trxId
                new TotalAmount($amount, 'IDR'),                // totalAmount
                new CreateVaRequestAdditionalInfo(              // additionalInfo
                    $channel,
                    new CreateVaVirtualAccountConfig(false)
                ),
                'C',                                            // virtualAccountTrxType: C = Closed Amount
                $expiredDate                                    // expiredDate
            );

            Log::info('DOKU VA: mengirim request ke SDK', [
                'order'            => $order->order_number,
                'partnerServiceId' => trim($partnerServiceId),
                'customerNo'       => $customerNo,
                'virtualAccountNo' => trim($virtualAccountNo),
                'trxId'            => $trxId,
                'amount'           => $amount,
                'channel'          => $channel,
                'expiredDate'      => $expiredDate,
            ]);

            // ── Panggil SDK ───────────────────────────────────────
            $result = $snap->createVa($dto);

            $responseCode    = $result->responseCode    ?? '';
            $responseMessage = $result->responseMessage ?? '';
            $vaNumber        = $result->virtualAccountData->virtualAccountNo ?? null;

            Log::info('DOKU VA: response dari SDK', [
                'order'           => $order->order_number,
                'responseCode'    => $responseCode,
                'responseMessage' => $responseMessage,
                'vaNumber'        => $vaNumber,
            ]);

            // responseCode "2002700" = sukses (format: HTTP200 + serviceCode27 + caseCode00)
            if (str_starts_with($responseCode, '200') && $vaNumber) {
                $order->update(['payment_code' => $vaNumber]);

                Log::info('DOKU VA: berhasil, VA tersimpan', [
                    'order'     => $order->order_number,
                    'va_number' => $vaNumber,
                ]);

                return redirect()->route('payment.code');
            }

            // Gagal response (bukan exception) — tetap redirect ke payment.code
            // Simpan placeholder agar halaman tidak blank
            Log::error('DOKU VA: response tidak sukses', [
                'order'           => $order->order_number,
                'responseCode'    => $responseCode,
                'responseMessage' => $responseMessage,
            ]);

            if (!$order->payment_code) {
                $order->update(['payment_code' => 'PENDING-' . $order->id]);
            }

            return redirect()->route('payment.code');

        } catch (\RuntimeException $e) {
            // Konfigurasi salah (private key tidak ada, dll)
            Log::error('DOKU VA: konfigurasi error', [
                'order'   => $order->order_number,
                'message' => $e->getMessage(),
            ]);

            if (!$order->payment_code) {
                $order->update(['payment_code' => 'PENDING-' . $order->id]);
            }

            return redirect()->route('payment.code');

        } catch (\Exception $e) {
            Log::error('DOKU VA: exception tidak terduga', [
                'order'   => $order->order_number,
                'class'   => get_class($e),
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);

            if (!$order->payment_code) {
                $order->update(['payment_code' => 'PENDING-' . $order->id]);
            }

            return redirect()->route('payment.code');
        }
    }

    // ─────────────────────────────────────────────────────────
    // CALLBACK / WEBHOOK dari DOKU
    // Route: POST /payment/doku/callback  (withoutMiddleware CSRF)
    // DOKU akan hit endpoint ini setelah customer bayar
    // ─────────────────────────────────────────────────────────
    public function callback(Request $request): JsonResponse
    {
        $rawBody  = $request->getContent();
        $clientId = $request->header('X-PARTNER-ID', '');

        Log::info('DOKU Callback: request masuk', [
            'x-partner-id' => $clientId,
            'x-timestamp'  => $request->header('X-TIMESTAMP'),
            'body_preview' => substr($rawBody, 0, 300),
        ]);

        // Validasi Client ID agar tidak bisa dipalsukan sembarang request
        if ($clientId !== config('doku.client_id')) {
            Log::warning('DOKU Callback: X-PARTNER-ID tidak cocok', [
                'expected' => config('doku.client_id'),
                'received' => $clientId,
            ]);
            return response()->json([
                'responseCode'    => '4010000',
                'responseMessage' => 'Unauthorized',
            ], 401);
        }

        $data = $request->all();

        // ── Parse trxId dan status ────────────────────────────
        // Format SNAP: field "trxId" dan "latestTransactionStatus" ("00" = sukses)
        // Format legacy: nested "order.invoice_number" dan "transaction.status" ("SUCCESS")
        $trxId    = $data['trxId']
                 ?? $data['order']['invoice_number']
                 ?? null;

        $txStatus = $data['latestTransactionStatus']
                 ?? $data['transaction']['status']
                 ?? null;

        Log::info('DOKU Callback: parsed', ['trxId' => $trxId, 'status' => $txStatus]);

        if (!$trxId) {
            return response()->json([
                'responseCode'    => '4000000',
                'responseMessage' => 'Bad Request: trxId missing',
            ], 400);
        }

        // ── Cari order ────────────────────────────────────────
        // trxId kita format: "TK20260014-1745000000"
        // order_number di DB: "#TK-20260014"
        // Jadi kita strip angka dan cari yang cocok
        $order = $this->findOrderByTrxId($trxId);

        if (!$order) {
            Log::warning('DOKU Callback: order tidak ditemukan', ['trxId' => $trxId]);
            // Return 200 agar DOKU tidak retry tanpa henti
            return response()->json(['responseCode' => '2000000', 'responseMessage' => 'OK']);
        }

        // ── Update status jika pembayaran sukses ──────────────
        $isPaid = ($txStatus === '00' || strtoupper($txStatus) === 'SUCCESS');

        if ($isPaid && $order->status === 'Menunggu') {
            $order->update([
                'status'  => 'Diproses',
                'paid_at' => now(),
            ]);
            Log::info('DOKU Callback: order berhasil diupdate ke Diproses', [
                'order' => $order->order_number,
            ]);
        } else {
            Log::info('DOKU Callback: tidak update order', [
                'order'        => $order->order_number,
                'order_status' => $order->status,
                'tx_status'    => $txStatus,
                'isPaid'       => $isPaid,
            ]);
        }

        return response()->json(['responseCode' => '2000000', 'responseMessage' => 'OK']);
    }

    // ─────────────────────────────────────────────────────────
    // HELPER: cari order berdasarkan trxId dari callback
    // ─────────────────────────────────────────────────────────
    private function findOrderByTrxId(string $trxId): ?Order
    {
        // trxId kita: "TK20260014-1745000000"
        // Coba berbagai format agar robust terhadap perubahan ke depan

        $candidates = [
            $trxId,                                          // exact match
            '#' . $trxId,                                   // "#TK20260014-..."
            '#TK-' . substr($trxId, 2, 4) . substr($trxId, 6, 4), // reformat ke #TK-20260014
        ];

        // Ekstrak bagian sebelum timestamp (sebelum "-" terakhir)
        $withoutTimestamp = preg_replace('/-\d+$/', '', $trxId); // "TK20260014"
        if ($withoutTimestamp !== $trxId) {
            // Reformat: "TK20260014" → "#TK-20260014"
            $formatted = '#' . substr($withoutTimestamp, 0, 2) . '-' . substr($withoutTimestamp, 2);
            $candidates[] = $formatted;
        }

        foreach (array_unique($candidates) as $candidate) {
            $order = Order::where('order_number', $candidate)->first();
            if ($order) return $order;
        }

        return null;
    }

    // ─────────────────────────────────────────────────────────
    // TOKEN URL — endpoint yang di-hit DOKU sebelum kirim notifikasi
    // Route: POST /payment/doku/token  (withoutMiddleware CSRF)
    // DOKU membutuhkan ini untuk verifikasi identitas merchant
    // ─────────────────────────────────────────────────────────
    public function generateToken(Request $request): JsonResponse
    {
        Log::info('DOKU Token Request: masuk', [
            'headers' => $request->headers->all(),
            'body'    => $request->all(),
        ]);

        try {
            $snap = $this->makeSnap();

            // SDK handle validasi signature dan generate token response
            $timestamp = $request->header('X-TIMESTAMP', '');
            $signature = $request->header('X-SIGNATURE', '');
            $clientId  = $request->header('X-CLIENT-KEY', '');

            // Validasi: Client ID harus cocok
            if ($clientId !== config('doku.client_id')) {
                Log::warning('DOKU Token: X-CLIENT-KEY tidak cocok', [
                    'expected' => config('doku.client_id'),
                    'received' => $clientId,
                ]);
                return response()->json([
                    'responseCode'    => '4010000',
                    'responseMessage' => 'Unauthorized',
                ], 401);
            }

            // Generate token B2B menggunakan SDK
            $tokenResponse = $snap->getTokenB2B();

            Log::info('DOKU Token: berhasil generate token', [
                'responseCode' => $tokenResponse->responseCode ?? '',
            ]);

            return response()->json($tokenResponse);

        } catch (\Exception $e) {
            Log::error('DOKU Token: exception', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return response()->json([
                'responseCode'    => '5000000',
                'responseMessage' => 'Internal Server Error',
            ], 500);
        }
    }
}
