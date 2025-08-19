<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::prefix('admin')->group(function () {
    Route::group(['middleware' => ['guest-with-session']], function () {
        Route::get('/', [\App\Http\Controllers\AdminController::class, 'index'])->name('admin.index');
        Route::post('/', [\App\Http\Controllers\AdminController::class, 'postIndex'])->name('admin.index.post');
    });
    Route::group(['middleware' => ['auth-with-session']], function () {
        Route::get('/transactions', [\App\Http\Controllers\AdminController::class, 'transactions'])->name('admin.transactions');

        Route::get('/games', [\App\Http\Controllers\AdminController::class, 'games'])->name('admin.games');
        Route::get('/games/create', [\App\Http\Controllers\AdminController::class, 'createGame'])->name('admin.games.create');
        Route::get('/games/{game}/edit', [\App\Http\Controllers\AdminController::class, 'editGame'])->name('admin.games.edit');

        Route::post('/games', [\App\Http\Controllers\AdminController::class, 'storeGame'])->name('admin.games.store');
        Route::post('/games/{game}', [\App\Http\Controllers\AdminController::class, 'updateGame'])->name('admin.games.update');
        Route::delete('/games/{game}', [\App\Http\Controllers\AdminController::class, 'destroyGame'])->name('admin.games.destroy');

        Route::get('/codes', [\App\Http\Controllers\AdminController::class, 'codes'])->name('admin.codes');
        Route::post('/codes', [\App\Http\Controllers\AdminController::class, 'storeCode'])->name('admin.codes.store');

        Route::post('/logout', [\App\Http\Controllers\AdminController::class, 'logout'])->name('admin.logout');
    });
});
