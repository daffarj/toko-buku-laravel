<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'book_id',
        'quantity',
        'price_at_time',
    ];

    protected function casts(): array
    {
        return [
            'quantity'      => 'integer',
            'price_at_time' => 'integer',
        ];
    }

    // ─── HELPERS ──────────────────────────────────────────────

    /**
     * Total harga item ini (harga × kuantitas)
     */
    public function getSubtotalAttribute(): int
    {
        return $this->price_at_time * $this->quantity;
    }

    // ─── RELASI ───────────────────────────────────────────────

    /**
     * Item keranjang dimiliki oleh satu user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Item keranjang merujuk ke satu buku
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
