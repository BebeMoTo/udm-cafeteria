<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\PayMongoService;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['web','auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('carts', CartController::class);
    Route::resource('stores', StoreController::class);
    Route::resource('orders', OrderController::class);

    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    Route::resource('users', UserController::class);
    Route::resource('items', ItemController::class);
    Route::put('/items/{item}', [ItemController::class, 'update'])->name('items.update');
    Route::post('/items/store', [ItemController::class, 'store']);





    //paymongo
    Route::get('/paymongo-test', function (PayMongoService $payMongoService) {
        $response = $payMongoService->createCheckoutSession([
            'line_items' => [
                [
                    'name' => 'Test Item',
                    'amount' => 2000, // PHP 10.00
                    'currency' => 'PHP',
                    'quantity' => 1,
                ],
            ],
            'payment_method_types' => ['card', 'gcash'], // Payment methods
            'description' => 'Test Payment',
            'redirect' => [
                'success' => url('/success'),
                'failed' => url('/failed'),
            ],
        ]);
    
        return response()->json($response);
    });
    
});

require __DIR__.'/auth.php';
