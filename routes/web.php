<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DokuController;
use App\Http\Controllers\Admin\AdminBookController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// ─── Customer Routes ──────────────────────────────────────────
Route::get('/', [BookController::class, 'index'])->name('home');
Route::get('/product/{id}', [BookController::class, 'show'])->name('product.show');

// Cart
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/{bookId}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{bookId}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

// Checkout & Payment
Route::get('/payment', [OrderController::class, 'payment'])->name('payment');
Route::post('/payment/confirm', [OrderController::class, 'confirm'])->name('payment.confirm');
Route::get('/payment/code', [OrderController::class, 'code'])->name('payment.code');
Route::post('/payment/verify', [OrderController::class, 'verify'])->name('payment.verify');
Route::get('/payment/success', [OrderController::class, 'success'])->name('payment.success');
Route::get('/payment/failed', [OrderController::class, 'failed'])->name('payment.failed');
Route::get('/order-confirmation', [OrderController::class, 'confirmation'])->name('order.confirmation');

// ─── DOKU Payment Routes ──────────────────────────────────────
Route::post('/payment/doku/va/create', [DokuController::class, 'createVirtualAccount'])->name('payment.doku.va');
Route::post('/payment/doku/qris/create', [DokuController::class, 'createQris'])->name('payment.doku.qris');

// Kedua route ini dipanggil DOKU dari luar — harus withoutMiddleware CSRF
Route::post('/payment/doku/token', [DokuController::class, 'generateToken'])
    ->name('payment.doku.token')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

Route::post('/payment/doku/callback', [DokuController::class, 'callback'])
    ->name('payment.doku.callback')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

// ─── Admin Routes ─────────────────────────────────────────────
Route::prefix('admin')->middleware(['admin'])->group(function () {
    // Dashboard
    Route::get('/', [AdminBookController::class, 'dashboard'])->name('admin.dashboard');

    // Products
    Route::get('/products', [AdminBookController::class, 'index'])->name('admin.products');
    Route::get('/products/add', [AdminBookController::class, 'create'])->name('admin.products.create');
    Route::post('/products', [AdminBookController::class, 'store'])->name('admin.products.store');
    Route::get('/products/edit/{id}', [AdminBookController::class, 'edit'])->name('admin.products.edit');
    Route::put('/products/{id}', [AdminBookController::class, 'update'])->name('admin.products.update');
    Route::delete('/products/{id}', [AdminBookController::class, 'destroy'])->name('admin.products.destroy');

    // Orders
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders');
    Route::get('/orders/{id}', [AdminOrderController::class, 'show'])->name('admin.orders.show');
    Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus'])->name('admin.orders.status');
});

// ─── Auth Routes (dari Breeze) ────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';