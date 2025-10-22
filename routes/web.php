<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\WebsiteController;
use Illuminate\Support\Facades\Route;


Route::prefix('admin')->group(function () {
    Route::group(['middleware' => ['guest-with-session']], function () {
        Route::get('/', [\App\Http\Controllers\AdminController::class, 'index'])->name('admin.index');
        Route::post('/', [\App\Http\Controllers\AdminController::class, 'postIndex'])->name('admin.index.post');
    });
    Route::group(['middleware' => ['auth-with-session']], function () {
        Route::get('/transactions', [AdminController::class, 'indexTransactions'])->name('admin.transactions.index');
        Route::get('/transactions/{id}', [AdminController::class, 'showTransactions'])->name('admin.transactions.show');

        Route::get('/games', [\App\Http\Controllers\AdminController::class, 'games'])->name('admin.games');
        Route::get('/games/create', [\App\Http\Controllers\AdminController::class, 'createGame'])->name('admin.games.create');
        Route::get('/games/{game}/edit', [\App\Http\Controllers\AdminController::class, 'editGame'])->name('admin.games.edit');

        Route::post('/games', [\App\Http\Controllers\AdminController::class, 'storeGame'])->name('admin.games.store');
        Route::post('/games/{game}', [\App\Http\Controllers\AdminController::class, 'updateGame'])->name('admin.games.update');
        Route::delete('/games/{game}', [\App\Http\Controllers\AdminController::class, 'destroyGame'])->name('admin.games.destroy');

        Route::get('/vouchers', [\App\Http\Controllers\AdminController::class, 'vouchers'])->name('admin.vouchers');
        Route::get('/vouchers/create', [\App\Http\Controllers\AdminController::class, 'createVoucher'])->name('admin.vouchers.create');
        Route::get('/voucher/{package}/edit', [\App\Http\Controllers\AdminController::class, 'editVoucher'])->name('admin.vouchers.edit');

        Route::post('/vouchers', [\App\Http\Controllers\AdminController::class, 'storeVoucher'])->name('admin.vouchers.store');
        // Route::post('/games/{game}', [\App\Http\Controllers\AdminController::class, 'updateGame'])->name('admin.games.update');
        // Route::delete('/games/{game}', [\App\Http\Controllers\AdminController::class, 'destroyGame'])->name('admin.games.destroy');

        Route::get('/codes', [\App\Http\Controllers\AdminController::class, 'codes'])->name('admin.codes');
        Route::post('/codes', [\App\Http\Controllers\AdminController::class, 'storeCode'])->name('admin.codes.store');

        Route::post('/logout', [\App\Http\Controllers\AdminController::class, 'logout'])->name('admin.logout');
    });
});

Route::get('/', [\App\Http\Controllers\WebsiteController::class, 'home'])->name('home');
Route::get('/search', [\App\Http\Controllers\WebsiteController::class, 'search'])->name('search');
Route::get('/check-transaction', [\App\Http\Controllers\WebsiteController::class, 'checkTransaction'])->name('check-transaction');
Route::get('/products/{productSlug}', [\App\Http\Controllers\WebsiteController::class, 'detailVoucher'])->name('detail-voucher');

Route::post('/payment', [WebsiteController::class, 'payment'])->name('payment');
Route::post('/check-transaction', [WebsiteController::class, 'postCheckTransaction'])->name('check-transaction.post');
Route::post('/callback', [WebsiteController::class, 'callback'])->name('callback')->withoutMiddleware('web');

// Route::get('/static-page', [\App\Http\Controllers\WebsiteController::class, 'staticPage'])->name('static-page');
Route::get('/terms-and-conditions', [\App\Http\Controllers\WebsiteController::class, 'termsAndConditions'])->name('terms-and-conditions');
Route::get('/contact-us', [\App\Http\Controllers\WebsiteController::class, 'contactUs'])->name('contact-us');
Route::get('/privacy-policy', [\App\Http\Controllers\WebsiteController::class, 'privacyPolicy'])->name('privacy-policy');
