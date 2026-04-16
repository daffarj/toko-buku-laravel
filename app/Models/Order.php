<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'shipping_address',
        'recipient_name',
        'recipient_phone',
        'payment_type',
        'payment_method',
        'payment_code',
        'subtotal',
        'shipping_cost',
        'tax',
        'grand_total',
        'paid_at',
        'shipped_at',
        'completed_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'subtotal'      => 'integer',
            'shipping_cost' => 'integer',
            'tax'           => 'integer',
            'grand_total'   => 'integer',
            'paid_at'       => 'datetime',
            'shipped_at'    => 'datetime',
            'completed_at'  => 'datetime',
        ];
    }

    // ─── HELPERS ──────────────────────────────────────────────

    /**
     * Format grand_total ke Rupiah
     */
    public function getFormattedGrandTotalAttribute(): string
    {
        return 'Rp ' . number_format($this->grand_total, 0, ',', '.');
    }

    /**
     * Warna badge status (sesuai adminOrders di mockData.ts)
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'Dikirim'    => 'bg-blue-100 text-blue-700',
            'Diproses'   => 'bg-amber-100 text-amber-700',
            'Selesai'    => 'bg-green-100 text-green-700',
            'Menunggu'   => 'bg-gray-100 text-gray-700',
            'Dibatalkan' => 'bg-red-100 text-red-700',
            default      => 'bg-gray-100 text-gray-700',
        };
    }

    /**
     * Apakah pesanan sudah dibayar?
     */
    public function getIsPaidAttribute(): bool
    {
        return !is_null($this->paid_at);
    }

    // ─── RELASI ───────────────────────────────────────────────

    /**
     * Pesanan dimiliki oleh satu user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Satu pesanan bisa punya banyak item
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Satu pesanan bisa punya banyak ulasan
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // ─── EVENTS ───────────────────────────────────────────────

    protected static function booted(): void
    {
        // Auto-generate order_number saat order dibuat
        static::creating(function (Order $order) {
            $year  = now()->year;
            $count = Order::whereYear('created_at', $year)->count() + 1;
            $order->order_number = sprintf('#TK-%d%04d', $year, $count);
        });
    }
}
