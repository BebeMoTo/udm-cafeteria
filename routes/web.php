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

    //cancel the order
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    //accept the order
    Route::post('/orders/{id}/accept', [OrderController::class, 'accept']);
    //accept the order
    Route::post('/orders/{id}/ready', [OrderController::class, 'ready']);
    //claim the order
    Route::post('/orders/{id}/claim', [OrderController::class, 'claim']);


    Route::resource('users', UserController::class);
    Route::resource('items', ItemController::class);
    Route::put('/items/{item}', [ItemController::class, 'update'])->name('items.update');
    Route::post('/items/store', [ItemController::class, 'store']);


    Route::post('/orders/paymongo', [OrderController::class, 'paymongo'])->name('orders.paymongo');
    Route::get('/orders/{order}/success', [OrderController::class, 'success'])->name('orders.success');
    Route::get('/orders/{order}/cancel', [OrderController::class, 'cancelPayment'])->name('orders.cancel');

    Route::post('/webhooks/paymongo', [OrderController::class, 'handleWebhook']);

    Route::get('/orders/success', [OrderController::class, 'generalSuccess'])->name('orders.success-general');
    Route::get('/orders/cancel', [OrderController::class, 'generalCancel'])->name('orders.cancel-general');
    Route::get('/setup-webhook', [OrderController::class, 'setupWebhook']);

    //for dashboard
    //not Seller
    Route::get('/dashboard', [OrderController::class, 'getTopSelling'])->name('dashboard');
    //past 7 days expenses
    
    //seller - update info of store
    Route::put('/stores/{store}', [StoreController::class, 'update'])->name('stores.update');
    //seller - get info of store
    Route::get('/stores', [StoreController::class, 'index'])->name('stores.index');


    //admin get the stores to be edit
    Route::get('/admin-stores', [StoreController::class, 'adminIndex'])->name('admin.stores');
    //admin - get store and items
    Route::get('/stores-physical', [StoreController::class, 'adminAdjustOrder'])->name('stores.physical');
    //admin physical payment
    Route::post('/orders/physical-payment', [OrderController::class, 'physicalPayment'])->name('orders.physicalPayment');

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
