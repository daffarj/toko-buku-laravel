<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->foreignId('book_id')
                  ->constrained('books')
                  ->onDelete('cascade');

            // Hanya bisa review buku yang sudah dibeli (optional enforcement)
            $table->foreignId('order_id')
                  ->nullable()
                  ->constrained('orders')
                  ->onDelete('set null');

            $table->unsignedTinyInteger('rating'); // 1-5
            $table->string('title')->nullable();   // Judul review
            $table->text('body')->nullable();       // Isi review

            // Status moderasi (admin bisa approve/reject review)
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');

            $table->timestamps();

            // Satu user hanya bisa review satu buku satu kali
            $table->unique(['user_id', 'book_id']);
            $table->index(['book_id', 'status']); // Untuk query rating per buku
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
