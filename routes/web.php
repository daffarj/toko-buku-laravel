<?php

    use App\Http\Controllers\BookController;
    use App\Http\Controllers\CartController;
    use App\Http\Controllers\OrderController;
    use App\Http\Controllers\Admin\AdminBookController;
    
    // Customer routes
    Route::get('/', [BookController::class, 'index'])->name('home');
    Route::get('/product/{id}', [BookController::class, 'show'])->name('product.show');
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::get('/payment', [OrderController::class, 'payment'])->name('payment');
    Route::get('/payment/code', [OrderController::class, 'code'])->name('payment.code');
    Route::get('/payment/success', [OrderController::class, 'success'])->name('payment.success');
    Route::get('/payment/failed', [OrderController::class, 'failed'])->name('payment.failed');
    
    // Admin routes (protected middleware)
    Route::prefix('admin')->middleware(['auth', 'role:admin'])->group(function() {
        Route::get('/', [AdminBookController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/products', [AdminBookController::class, 'index'])->name('admin.products');
        Route::get('/products/add', [AdminBookController::class, 'create'])->name('admin.products.create');
        Route::post('/products', [AdminBookController::class, 'store'])->name('admin.products.store');
        Route::get('/products/edit/{id}', [AdminBookController::class, 'edit'])->name('admin.products.edit');
        Route::put('/products/{id}', [AdminBookController::class, 'update'])->name('admin.products.update');
        Route::delete('/products/{id}', [AdminBookController::class, 'destroy'])->name('admin.products.destroy');
    });
