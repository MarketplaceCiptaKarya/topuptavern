<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [\App\Http\Controllers\WebsiteController::class, 'home'])->name('home');
Route::get('/check-transaction', [\App\Http\Controllers\WebsiteController::class, 'checkTransaction'])->name('check-transaction');
Route::get('/products/{productSlug}', [\App\Http\Controllers\WebsiteController::class, 'detailVoucher'])->name('detail-voucher');
