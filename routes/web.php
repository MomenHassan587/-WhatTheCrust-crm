<?php

// routes/web.php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderTrackingController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StaffOrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::get('/menu', [MenuController::class, 'index']);

    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/track/{token}', [OrderTrackingController::class, 'show'])->middleware('throttle:60,1');
    Route::post('/payments/intents', [PaymentController::class, 'createIntent']);
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);

    Route::middleware('auth')->group(function () {
        Route::get('/orders/history', [OrderTrackingController::class, 'history']);
        Route::post('/orders/{order}/reorder', [OrderTrackingController::class, 'reorder']);
    });

    Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
        Route::get('/orders', [StaffOrderController::class, 'index']);
        Route::get('/orders/{order}', [StaffOrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [StaffOrderController::class, 'updateStatus']);
    });

    Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/catalog', [AdminController::class, 'catalog']);
        Route::post('/products', [AdminController::class, 'storeProduct']);
        Route::post('/products/{menuItem}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{menuItem}', [AdminController::class, 'disableProduct']);
        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::put('/categories/{category}', [AdminController::class, 'updateCategory']);
        Route::get('/branches', [AdminController::class, 'branches']);
        Route::put('/branches/{branch}', [AdminController::class, 'updateBranch']);
        Route::get('/staff', [AdminController::class, 'staff']);
        Route::post('/staff', [AdminController::class, 'storeStaff']);
        Route::put('/staff/{user}', [AdminController::class, 'updateStaff']);
        Route::put('/staff/{user}/password', [AdminController::class, 'resetPassword']);
        Route::get('/orders', [AdminController::class, 'orders']);
        Route::get('/orders/export', [AdminController::class, 'exportOrders']);
        Route::get('/customers', [AdminController::class, 'customers']);
        Route::get('/settings', [AdminController::class, 'settings']);
        Route::put('/settings', [AdminController::class, 'updateSettings']);
        Route::get('/audit', [AdminController::class, 'audit']);
    });
});

Route::get('/{view?}', function () {
    return view('app');
})->where('view', '^(?!api).*$');
