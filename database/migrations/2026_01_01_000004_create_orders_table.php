<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Format: TK-20260001 (ditambahkan via Model boot)
            $table->string('order_number', 20)->unique();

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('restrict'); // Jangan hapus user yang punya order

            // Status pesanan (sesuai mockData adminOrders)
            $table->enum('status', [
                'Menunggu',     // Baru dibuat, belum bayar
                'Diproses',     // Pembayaran diterima, sedang dikemas
                'Dikirim',      // Sudah dikirim ke kurir
                'Selesai',      // Diterima pembeli
                'Dibatalkan',   // Dibatalkan
            ])->default('Menunggu');

            // Alamat pengiriman (disimpan snapshot, bukan FK ke users.address
            // karena user bisa ganti alamat nanti)
            $table->text('shipping_address');
            $table->string('recipient_name');
            $table->string('recipient_phone', 20);

            // Metode pembayaran (sesuai PaymentMethod.tsx)
            $table->enum('payment_type', ['bank', 'ewallet', 'card']);
            $table->string('payment_method', 30); // BCA, GoPay, OVO, dll
            $table->string('payment_code')->nullable(); // Kode virtual account / transfer

            // Rincian harga
            $table->unsignedInteger('subtotal');    // Total harga buku
            $table->unsignedInteger('shipping_cost')->default(15000);
            $table->unsignedInteger('tax');         // PPN 11%
            $table->unsignedInteger('grand_total'); // subtotal + ongkir + pajak

            // Waktu pembayaran
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->text('notes')->nullable(); // Catatan dari pembeli

            $table->timestamps();

            // Index untuk filter di halaman admin
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
