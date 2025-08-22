<?php

namespace App\Http\Controllers;

use App\Models\CategoryVoucher;
use App\Models\Code;
use App\Models\Game;
use App\Models\Package;
use App\Models\Product;
use App\Models\ProductGallery;
use Database\Seeders\CategorySeeder;
use Database\Seeders\StaticWebsiteDatumSeeder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/login');
    }

    public function transactions()
    {
        return Inertia::render(
            'admin/transactions'
        );
    }

    public function postIndex(Request $request)
    {
        $identifier = hash('SHA256', '5Bl/Q5hxc8WfpPKKA8LJhw==');
        $inputCode = $request->input('code');

        $code = Code::where('identifier', $identifier)->first();

        if (!$code) {
            return redirect()->back()->withErrors([
                'code' => 'Invalid access code.',
            ]);
        }

        if (!Hash::check($inputCode, $code->access_code)) {
            return redirect()->back()->withErrors([
                'code' => 'Invalid access code.',
            ]);
        }

        Session::put('admin-code-id', $code->id);

        // if ($request->input('code') != '123') {
        //     return redirect()->back()->withErrors([
        //         'code' => 'Invalid access code.',
        //     ]);
        // }
        // Session::put('admin-code-id', 1);
        return to_route('admin.transactions');
    }

    public function games(Request $request)
    {
        $search = $request->query('search', '');

        $games = \App\Models\Game::query()
            ->where(function ($query) use ($search) {
                $query->where('name', 'ilike', '%' . $search . '%');
            })
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/games', [
            'games' => $games,
            'search' => $search,
        ]);
    }

    public function createGame()
    {
        return Inertia::render('admin/add-games');
    }

    public function storeGame(Request $request)
    {
        $validated = $request->validate([
            'game_logo'       => 'nullable|image|max:2048',
            'game_name'       => 'required|string|max:255',
            'game_company'    => 'required|string|max:255',
            'how_to'     => 'nullable|string',
            'topup_data' => 'array',
            'topup_data.*'    => 'required|string|max:255|distinct',
            'vouchers'        => 'nullable|array',
            'vouchers.*.name' => 'nullable|string|max:255',
            'vouchers.*.inputs' => 'array',
            'vouchers.*.inputs.*.packageName' => 'nullable|string|max:255',
            'vouchers.*.inputs.*.amount' => 'required|numeric|min:0',
        ], [
            'topup_data.*.distinct' => 'Duplicate values are not allowed in top-up fields.',
        ]);


        // handle file upload if exists
        $path = null;
        if ($request->hasFile('game_logo')) {
            $mediaFile = $request->file('game_logo');
            $filename = Str::slug($validated['game_name']) . '-' . Str::random(5) . '.' . $mediaFile->getClientOriginalExtension();
            $path = $mediaFile->storeAs('games', $filename, 'public');
        }

        // generate slug
        $slug = Str::slug($validated['game_name']) . '-' . Str::random(5);

        // store game
        $game = Game::create([
            'logo'       => $path,
            'name'       => $validated['game_name'],
            'slug'       => $slug,
            'company'    => $validated['game_company'],
            'how_to'     => $validated['how_to'] ?? null,
            'topup_data' => $validated['topup_data'] ?? [],
        ]);


        // handle vouchers
        if (!empty($validated['vouchers'])) {
            foreach ($validated['vouchers'] as $voucherCategory) {
                $category = CategoryVoucher::create([
                    'game_id' => $game->id,
                    'name'    => $voucherCategory['name'],
                ]);

                foreach ($voucherCategory['inputs'] as $package) {
                    Package::create([
                        'category_voucher_id' => $category->id,
                        'name'     => $package['packageName'],
                        'price'    => $package['amount'],
                        'quantity' => 0,
                    ]);
                }
            }
        }

        return redirect()->back();
    }

    public function editGame(Game $game)
    {
        $game->load(['categoryVoucher.packages']);
        return Inertia::render('admin/edit-games', [
            'game' => $game,
        ]);
    }

    public function updateGame(Game $game, Request $request)
    {
        // validate request
        $validated = $request->validate([
            'game_logo'        => 'nullable|image|max:2048',
            'game_name'        => 'required|string|max:255',
            'game_company'     => 'required|string|max:255',
            'how_to'      => 'nullable|string',
            'topup_data'  => 'array',
            'topup_data.*'    => 'required|string|max:255|distinct',
            'vouchers'         => 'nullable|array',
            'vouchers.*.name'  => 'nullable|string|max:255',
            'vouchers.*.inputs' => 'array',
            'vouchers.*.inputs.*.packageName' => 'nullable|string|max:255',
            'vouchers.*.inputs.*.amount' => 'required|numeric|min:0',
        ], [
            'topup_data.*.distinct' => 'Duplicate values are not allowed in top-up fields.',
        ]);

        $game = Game::with([
            'categoryVoucher'
        ])->findOrFail($game->id);

        // dd($game);
        // handle file upload if exists
        $path = $game->logo; // keep old logo by default
        if ($request->hasFile('game_logo')) {
            $mediaFile = $request->file('game_logo');
            $filename = Str::slug($request->game_name) . '-' . Str::random(5) . '.' . $mediaFile->getClientOriginalExtension();
            $path = $mediaFile->storeAs('games', $filename, 'public');
        }

        // update game
        $game->update([
            'logo'       => $path,
            'name'       => $validated['game_name'],
            'company'    => $validated['game_company'],
            'how_to'     => $validated['how_to'] ?? null,
            'topup_data' => $validated['topup_data'] ?? [],
        ]);

        // clear old vouchers
        foreach ($game->categoryVoucher as $category) {
            Package::where('category_voucher_id', $category->id)->delete();
        }

        CategoryVoucher::where('game_id', $game->id)->delete();

        // reinsert vouchers
        if (!empty($validated['vouchers'])) {
            foreach ($validated['vouchers'] as $voucherCategory) {
                $category = CategoryVoucher::create([
                    'game_id' => $game->id,
                    'name' => $voucherCategory['name'],
                ]);

                foreach ($voucherCategory['inputs'] as $package) {
                    Package::create([
                        'category_voucher_id' => $category->id,
                        'name' => $package['packageName'],
                        'price' => $package['amount'],
                        'quantity' => 0,
                    ]);
                }
            }
        }

        return redirect()->back();
    }

    public function destroyGame(Game $game)
    {
        $game->delete();
        return redirect()->back();
    }

    public function vouchers(Request $request)
    {
        $search = $request->query('search', '');

        $packages = \App\Models\Package::query()
            ->whereNull('deleted_at') // package not deleted
            ->where(function ($query) use ($search) {
                $query->where('name', 'ilike', '%' . $search . '%')
                    ->orWhereHas('categoryVoucher', function ($cq) use ($search) {
                        $cq->whereNull('deleted_at') // category not deleted
                            ->where(function ($cq2) use ($search) {
                                $cq2->where('name', 'ilike', '%' . $search . '%')
                                    ->orWhereHas('game', function ($gq) use ($search) {
                                        $gq->whereNull('deleted_at') // game not deleted
                                            ->where('name', 'ilike', '%' . $search . '%');
                                    });
                            });
                    });
            })
            ->with([
                'categoryVoucher' => function ($q) {
                    $q->whereNull('deleted_at')
                        ->with(['game' => function ($g) {
                            $g->whereNull('deleted_at');
                        }]);
                },
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/vouchers', [
            'packages' => $packages,
            'search' => $search,
        ]);
    }


    public function createVoucher()
    {
        $games = Game::whereNotNull('deleted_at')->get();
        return Inertia::render('admin/add-vouchers', [
            'games' => $games,
        ]);
    }

    public function editVoucher(Package $package)
    {
        $package->load(['categoryVoucher.game']);
        return Inertia::render('admin/add-vouchers', [
            'package' => $package,
        ]);
    }

    public function storeVoucher(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'vouchers'   => 'required|array|min:1',
            'vouchers.*' => 'required|string|max:255|distinct',
        ], [
            'vouchers.*.distinct' => 'Duplicate values are not allowed in voucher code fields.',
        ]);

        // insert vouchers
        foreach ($validated['vouchers'] as $code) {
            \App\Models\Voucher::create([
                'package_id'   => $validated['package_id'],
                'voucher_code' => $code,
            ]);
        }

        // increment package quantity
        \App\Models\Package::where('id', $validated['package_id'])
            ->increment('quantity', count($validated['vouchers']));

        return redirect()->back();
    }

    public function codes()
    {
        return Inertia::render('admin/edit-code');
    }

    public function storeCode(Request $request)
    {
        $sessionCodeId = $request->session()->get('admin-code-id');
        $code = $request->input('code');

        $currentCode = Code::where('id', $sessionCodeId)->first();

        if (!$currentCode) {
            return redirect()->back()->withErrors([
                'code' => 'Invalid session code.',
            ]);
        }

        $currentCode->update(['access_code' => Hash::make($code)]);

        return redirect()->back();
    }

    public function logout(Request $request)
    {
        $request->session()->forget('admin-code-id');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('admin.index');
    }
}
