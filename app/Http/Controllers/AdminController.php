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
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
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
        // $identifier = hash('SHA256', '5Bl/Q5hxc8WfpPKKA8LJhw==');
        // $inputCode = $request->input('code');

        // $code = Code::where('identifier', $identifier)->first();

        // if (!$code) {
        //     return redirect()->back()->withErrors([
        //         'code' => 'Invalid access code.',
        //     ]);
        // }

        // if (!\Hash::check($inputCode, $code->access_code)) {
        //     return redirect()->back()->withErrors([
        //         'code' => 'Invalid access code.',
        //     ]);
        // }

        // Session::put('admin-code-id', $code->id);

        if ($request->input('code') != '123') {
            return redirect()->back()->withErrors([
                'code' => 'Invalid access code.',
            ]);
        }
        Session::put('admin-code-id', 1);
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
            'logo_game'       => 'nullable|image|max:2048',
            'nama_game'       => 'required|string|max:255',
            'perusahaan_game' => 'required|string|max:255',
            'howTo' => 'nullable',
            'topupData' => 'array',
            'vouchers'        => 'nullable|array',
            'vouchers.*.name' => 'nullable|string|max:255',
            'vouchers.*.inputs' => 'array',
            'vouchers.*.inputs.*.packageName' => 'nullable|string|max:255',
            'vouchers.*.inputs.*.amount'      => 'required|numeric|min:0',
        ]);

        $path = null;
        if ($request->hasFile('logo_game')) {
            $mediaFile = $request->file('logo_game');

            $filename = Str::slug($request->nama_game) . '-' . Str::random(5) . '.' . $mediaFile->getClientOriginalExtension();

            // Simpan ke storage/app/public/games
            $path = $mediaFile->storeAs('games', $filename, 'public');
        }

        $topupDataString = null;
        if (!empty($validated['topupData'])) {
            $topupDataString = implode(', ', array_map(fn($item) => $item['name'], $validated['topupData']));
        }

        // dd($validated['howTo']);
        $game = Game::create([
            'logo'       => $path,
            'name'       => $validated['nama_game'],
            'company' => $validated['perusahaan_game'],
            'how_to' => $validated['howTo'],
            'topup_data' => $topupDataString,
        ]);

        foreach ($request->vouchers as $voucherCategory) {
            $category = CategoryVoucher::create([
                'game_id' => $game->id,
                'name'    => $voucherCategory['name'],
            ]);

            foreach ($voucherCategory['inputs'] as $package) {
                Package::create([
                    'category_voucher_id' => $category->id,
                    'name'   => $package['packageName'],
                    'price'  => $package['amount'],
                    'quantity' => 0,
                ]);
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
        $validated = $request->validate([
            'logo_game'       => 'nullable|image|max:2048',
            'nama_game'       => 'required|string|max:255',
            'perusahaan_game' => 'required|string|max:255',
            'howTo'           => 'nullable',
            'topupData'       => 'array',
            'vouchers'        => 'nullable|array',
            'vouchers.*.name' => 'nullable|string|max:255',
            'vouchers.*.inputs' => 'array',
            'vouchers.*.inputs.*.packageName' => 'nullable|string|max:255',
            'vouchers.*.inputs.*.amount'      => 'required|numeric|min:0',
        ]);

        // Handle logo
        $path = $game->logo; // keep old if not replaced
        if ($request->hasFile('logo_game')) {
            $mediaFile = $request->file('logo_game');
            $filename = Str::slug($request->nama_game) . '-' . Str::random(5) . '.' . $mediaFile->getClientOriginalExtension();
            // upload to S3
            $path = $mediaFile->storeAs('games', $filename, 's3');

            // delete old file if exists on S3 //
            //         wait s3 setup           //
            //                                 //
            /////////////////////////////////////
            // if ($game->logo && \Storage::disk('s3')->exists($game->logo)) {
            //     \Storage::disk('s3')->delete($game->logo);
            // }
        }

        // Handle topupData
        $topupDataString = null;
        if (!empty($validated['topupData'])) {
            $topupDataString = implode(', ', array_map(fn($item) => $item['name'], $validated['topupData']));
        }

        // Update game
        $game->update([
            'logo'       => $path,
            'name'       => $validated['nama_game'],
            'company'    => $validated['perusahaan_game'],
            'how_to'     => $validated['howTo'],
            'topup_data' => $topupDataString,
        ]);

        // 🔥 Remove old relations (cascade delete recommended on DB)
        $game->categoryVoucher()->each(function ($category) {
            $category->packages()->delete();
            $category->delete();
        });

        // Recreate vouchers
        if (!empty($request->vouchers)) {
            foreach ($request->vouchers as $voucherCategory) {
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

    public function destroyGame(Game $game)
    {
        $game->delete();
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
