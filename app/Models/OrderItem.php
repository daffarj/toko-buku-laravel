<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'book_id',
        'quantity',
        'price',
        'original_price',
        'subtotal',
        'book_title',
        'book_author',
        'book_cover',
    ];

    protected function casts(): array
    {
        return [
            'quantity'       => 'integer',
            'price'          => 'integer',
            'original_price' => 'integer',
            'subtotal'       => 'integer',
        ];
    }

    // ─── HELPERS ──────────────────────────────────────────────

    /**
     * Format harga ke Rupiah
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return 'Rp ' . number_format($this->subtotal, 0, ',', '.');
    }

    // ─── RELASI ───────────────────────────────────────────────

    /**
     * Item ini bagian dari satu pesanan
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Item ini merujuk ke satu buku
     * (nullable karena buku bisa dihapus, tapi snapshot sudah disimpan)
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class)->withTrashed();
    }
}
