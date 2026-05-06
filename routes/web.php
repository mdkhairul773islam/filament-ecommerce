<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BuyNowController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Dynamic Pages
Route::get('/p/{slug}', [PageController::class, 'show'])->name('page.show');

// Products
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');

// Guest routes
Route::middleware('guest:web')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

// Cart (can be used by guests and authenticated users)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

// Checkout
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

// Buy Now (direct purchase from product page)
Route::post('/buy-now', [BuyNowController::class, 'store'])->name('buy-now');

// Payment
Route::get('/payment/{order}', [PaymentController::class, 'show'])->name('payment.show');
Route::post('/payment/{order}/confirm', [PaymentController::class, 'confirm'])->name('payment.confirm');
Route::post('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');

// SSLCommerz
Route::get('/payment/{order}/sslcommerz/init', [PaymentController::class, 'sslcommerzInit'])->name('payment.sslcommerz.init');
Route::match(['get', 'post'], '/payment/{order}/sslcommerz/success', [PaymentController::class, 'sslcommerzSuccess'])->name('payment.sslcommerz.success');
Route::match(['get', 'post'], '/payment/{order}/sslcommerz/fail', [PaymentController::class, 'sslcommerzFail'])->name('payment.sslcommerz.fail');
Route::match(['get', 'post'], '/payment/{order}/sslcommerz/cancel', [PaymentController::class, 'sslcommerzCancel'])->name('payment.sslcommerz.cancel');
Route::post('/payment/sslcommerz/ipn', [PaymentController::class, 'sslcommerzIpn'])->name('payment.sslcommerz.ipn');

// Order detail (accessible by guests for their own guest orders)
Route::get('/orders/{orderNumber}', [OrderController::class, 'show'])->name('orders.show');

// Authenticated routes
Route::middleware('auth:web')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Dashboard
    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Orders list (auth only)
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
});

Route::get('/linkstorage', function () {
    Artisan::call('storage:link');

    return 'Storage link created successfully!';
});

Route::get('/optimize-clear', function () {
    Artisan::call('optimize:clear');

    return 'Optimize clear successfully!';
});
