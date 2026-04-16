<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();

            // Informasi utama buku
            $table->string('title');
            $table->string('author');
            $table->string('category');         // Fiksi, Non-Fiksi, Edukasi, Komik, Biografi

            // Harga
            $table->unsignedInteger('price');
            $table->unsignedInteger('original_price')->nullable(); // Harga sebelum diskon

            // Rating (dihitung otomatis dari tabel reviews)
            $table->decimal('rating', 3, 1)->default(0);
            $table->unsignedInteger('review_count')->default(0);

            // Media
            $table->string('cover')->nullable();    // Path/URL gambar cover

            // Stok
            $table->boolean('in_stock')->default(true);
            $table->unsignedInteger('stock')->default(0);

            // Detail bibliografi
            $table->string('isbn', 20)->nullable()->unique();
            $table->string('publisher')->nullable();
            $table->smallInteger('year')->nullable();
            $table->unsignedSmallInteger('pages')->nullable();
            $table->string('language', 50)->default('Indonesia');
            $table->string('description')->nullable();  // Deskripsi singkat/genre
            $table->text('synopsis')->nullable();       // Sinopsis panjang

            $table->timestamps();
            $table->softDeletes(); // Agar data tidak hilang permanen saat dihapus admin

            // Index untuk pencarian & filter
            $table->index('category');
            $table->index('in_stock');
            $table->index('price');
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
