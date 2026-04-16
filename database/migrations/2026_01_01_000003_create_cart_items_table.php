<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();

            // Keranjang bisa milik user login ATAU guest (via session)
            $table->foreignId('user_id')
                  ->nullable()                    // Null = guest
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('session_id')->nullable(); // Untuk guest checkout

            $table->foreignId('book_id')
                  ->constrained('books')
                  ->onDelete('cascade');

            $table->unsignedSmallInteger('quantity')->default(1);

            // Simpan harga saat ditambahkan ke cart
            // (harga buku bisa berubah, kita simpan harga waktu itu)
            $table->unsignedInteger('price_at_time');

            $table->timestamps();

            // Satu user/session hanya bisa punya 1 row per buku di cart
            $table->unique(['user_id', 'book_id']);
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
