<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'order_id',
        'rating',
        'title',
        'body',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }

    // ─── SCOPES ───────────────────────────────────────────────

    /**
     * Hanya review yang sudah diapprove
     * Contoh: Review::approved()->get()
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    // ─── RELASI ───────────────────────────────────────────────

    /**
     * Review ditulis oleh satu user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Review untuk satu buku
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Review terkait dengan satu order (opsional)
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // ─── EVENTS ───────────────────────────────────────────────

    protected static function booted(): void
    {
        // Setiap kali review dibuat/diupdate/dihapus,
        // otomatis recalculate rating & review_count di tabel books
        $recalculate = function (Review $review) {
            $book = Book::find($review->book_id);
            if (!$book) return;

            $stats = Review::approved()
                ->where('book_id', $review->book_id)
                ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total')
                ->first();

            $book->update([
                'rating'       => round($stats->avg_rating ?? 0, 1),
                'review_count' => $stats->total ?? 0,
            ]);
        };

        static::saved($recalculate);
        static::deleted($recalculate);
    }
}
