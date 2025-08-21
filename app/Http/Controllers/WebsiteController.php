<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteController extends Controller
{
    public function home(): Response
    {
        $games = Game::select(['slug', 'logo', 'name'])->get();

        return Inertia::render('welcome', [
            'games' => $games,
        ]);
    }

    public function checkTransaction(): Response
    {
        return Inertia::render('check-transaction');
    }

    public function detailVoucher(string $productSlug): Response
    {
        $game = Game::query()->with([
            'categoryVoucher',
            'categoryVoucher.packages'
        ])->where('slug', $productSlug)->firstOrFail();
        
        return Inertia::render('detail-voucher', [
            'game' => $game,
        ]);
    }
}
