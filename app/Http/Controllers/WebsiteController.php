<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class WebsiteController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('welcome');
    }

    public function checkTransaction(): Response
    {
        return Inertia::render('check-transaction');
    }

    public function detailVoucher(string $productSlug): Response
    {
        return Inertia::render('detail-voucher', [
            'title' => 'Voucher 1',
            'slug' => $productSlug,
        ]);
    }
}
