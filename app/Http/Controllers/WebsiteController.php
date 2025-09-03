<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\StaticWebsiteDatum;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteController extends Controller
{
    public function home(): Response
    {
        $games = Game::select(['slug', 'logo', 'name'])->orderBy('name')->get();

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


    public function staticPage(): Response
    {
        return Inertia::render('static-page');
    }

    public function search(Request $request)
    {
        if (!$request->expectsJson()) {
            return response()->json(['error' => 'Invalid request'], 400);
        }

        $query = $request->query('q', '');

        $result = Game::query()
            ->where('name', 'ilike', '%' . $query . '%')
            ->orWhereHas('categoryVoucher', function ($q) use ($query) {
                $q->where('name', 'ilike', '%' . $query . '%');
            })
            ->orWhereHas('categoryVoucher.packages', function ($q) use ($query) {
                $q->where('name', 'ilike', '%' . $query . '%');
            })
            ->with(['categoryVoucher', 'categoryVoucher.packages'])
            ->select(['slug', 'logo', 'name'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'games' => $result,
        ])->withHeaders([
            'Content-Type' => 'application/json',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    public function contactUs()
    {
        $data = StaticWebsiteDatum::where('key', 'contact-us')
            ->firstOrFail();

        return Inertia::render('static-page', [
            'title' => 'Contact Us',
            'content' => $data->value,
        ]);
    }

    public function privacyPolicy()
    {
        $data = StaticWebsiteDatum::where('key', 'privacy-policy')
            ->firstOrFail();

        return Inertia::render('static-page', [
            'title' => 'Privacy Policy',
            'content' => $data->value,
        ]);
    }

    public function termsAndConditions()
    {
        $data = StaticWebsiteDatum::where('key', 'terms-and-conditions')
            ->firstOrFail();

        return Inertia::render('static-page', [
            'title' => 'Terms And Conditions',
            'content' => $data->value,
        ]);
    }
}
