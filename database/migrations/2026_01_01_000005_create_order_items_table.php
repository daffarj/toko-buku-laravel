<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                  ->constrained('orders')
                  ->onDelete('cascade');

            $table->foreignId('book_id')
                  ->constrained('books')
                  ->onDelete('restrict'); // Buku tidak boleh dihapus jika ada di order

            $table->unsignedSmallInteger('quantity');

            // Snapshot harga saat order dibuat
            // (harga asli bisa berubah, ini adalah harga yang benar-benar dibayar)
            $table->unsignedInteger('price');           // Harga per buku saat order
            $table->unsignedInteger('original_price')->nullable(); // Harga sebelum diskon
            $table->unsignedInteger('subtotal');        // price * quantity

            // Snapshot judul & cover (untuk tampilan riwayat pesanan
            // meskipun buku sudah dihapus/diubah)
            $table->string('book_title');
            $table->string('book_author');
            $table->string('book_cover')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
