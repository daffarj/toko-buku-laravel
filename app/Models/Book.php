<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'author',
        'category',
        'price',
        'original_price',
        'rating',
        'review_count',
        'cover',
        'in_stock',
        'stock',
        'isbn',
        'publisher',
        'year',
        'pages',
        'language',
        'description',
        'synopsis',
    ];

    protected function casts(): array
    {
        return [
            'price'          => 'integer',
            'original_price' => 'integer',
            'rating'         => 'float',
            'review_count'   => 'integer',
            'in_stock'       => 'boolean',
            'stock'          => 'integer',
            'year'           => 'integer',
            'pages'          => 'integer',
        ];
    }

    // ─── HELPERS ──────────────────────────────────────────────

    /**
     * Format harga ke Rupiah: "Rp 85.000"
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function getFormattedOriginalPriceAttribute(): ?string
    {
        if (!$this->original_price) return null;
        return 'Rp ' . number_format($this->original_price, 0, ',', '.');
    }

    /**
     * Apakah buku sedang diskon?
     */
    public function getIsDiscountedAttribute(): bool
    {
        return !is_null($this->original_price) && $this->original_price > $this->price;
    }

    /**
     * Persentase diskon
     */
    public function getDiscountPercentAttribute(): int
    {
        if (!$this->is_discounted) return 0;
        return (int) round((($this->original_price - $this->price) / $this->original_price) * 100);
    }

    // ─── SCOPES ───────────────────────────────────────────────

    /**
     * Filter buku yang tersedia stok
     * Contoh: Book::available()->get()
     */
    public function scopeAvailable($query)
    {
        return $query->where('in_stock', true)->where('stock', '>', 0);
    }

    /**
     * Filter berdasarkan kategori
     * Contoh: Book::byCategory('Fiksi')->get()
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Pencarian berdasarkan judul atau penulis
     * Contoh: Book::search('tere liye')->get()
     */
    public function scopeSearch($query, string $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('title', 'like', "%{$keyword}%")
              ->orWhere('author', 'like', "%{$keyword}%");
        });
    }

    // ─── RELASI ───────────────────────────────────────────────

    /**
     * Satu buku bisa ada di banyak item pesanan
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Satu buku bisa ada di banyak keranjang
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Satu buku bisa punya banyak ulasan
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // ─── EVENTS ───────────────────────────────────────────────

    protected static function booted(): void
    {
        // Otomatis update in_stock saat stock diubah
        static::saving(function (Book $book) {
            if ($book->isDirty('stock')) {
                $book->in_stock = $book->stock > 0;
            }
        });
    }
}
