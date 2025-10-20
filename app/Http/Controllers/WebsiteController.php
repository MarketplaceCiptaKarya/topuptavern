<?php

namespace App\Http\Controllers;

use App\Models\DTrans;
use App\Models\DTransVoucher;
use App\Models\Game;
use App\Models\HTrans;
use App\Models\Package;
use App\Models\StaticWebsiteDatum;
use App\Models\Voucher;
use App\PaymentGateway\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    private PaymentGateway $paymentGateway;

    public function __construct(PaymentGateway $paymentGateway)
    {
        $this->paymentGateway = $paymentGateway;
    }

    public function payment(Request $request)
    {

        try {
            $dummyPayload = [
                'status' => 'SUCCESS',
                'external_id' => time(),
                'email' => $request->email,
                'name' => $request->name,
                'address' => $request->address,
                'total' => $request->total,
                'topup_data' => $request->topupData ?? [],
                'package_id' => $request->selectedVoucherId,
                'quantity' => $request->quantity,
            ];

            // You can call callback() directly
            session(['dummy_payment' => true, 'payload' => $dummyPayload]);

            // Instead of redirecting to payment gateway, go straight to callback
            return redirect()->route('callback');
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to simulate payment.',
                'error' => $th->getMessage(),
            ], 500);
        }
        // $paymentGatewayPayload = [
        //     // 'external_id' => $transactionHeader->id,
        //     // 'order_id' => $transactionHeader->invoice_number,
        //     // 'amount' => (int)$totalPrice * $currency,
        //     // 'description' => 'Transaction for ' . $transactionHeader->invoice_number,
        //     // 'customer_details' => [
        //     //     'full_name' => $transactionHeader->customer_billing_first_name . ' ' . $transactionHeader->customer_billing_last_name,
        //     //     'email' => $transactionHeader->customer_contact,
        //     //     'address' => $transactionHeader->customer_shipping_address,
        //     // ],
        //     'external_id' => time(),
        //     'order_id' => 'ORDER-' . now()->timestamp,
        //     'amount' => $request->total,
        //     'description' => 'Transaction for ' . $request->email,
        //     'customer_details' => [
        //         'full_name' => $request->name,
        //         'email' => $request->email,
        //         'address' => $request->address,
        //     ],
        //     'selected_channels' => [
        //         [
        //             "channel" => "VA",
        //             "acq" => "BCA"
        //         ],
        //         [
        //             "channel" => "VA",
        //             "acq" => "CIMB"
        //         ],
        //         [
        //             "channel" => "VA",
        //             "acq" => "Permata"
        //         ],
        //         [
        //             "channel" => "VA",
        //             "acq" => "MANDIRI"
        //         ],
        //         [
        //             "channel" => "VA",
        //             "acq" => "BNI"
        //         ],
        //         [
        //             "channel" => "VA",
        //             "acq" => "BRI"
        //         ],
        //         [
        //             "channel" => "VA",
        //             "acq" => "BNC"
        //         ],
        //         [
        //             "channel" => "VA",
        //             "acq" => "Finpay"
        //         ],
        //         [
        //             "channel" => "OVO"
        //         ],
        //         [
        //             "channel" => "DANA"
        //         ],
        //         [
        //             "channel" => "LINKAJA"
        //         ],
        //         [
        //             "channel" => "SHOPEEPAY"
        //         ],
        //         [
        //             "channel" => "VIRGO"
        //         ],
        //         [
        //             "channel" => "QRIS",
        //             "acq" => "NOBU"
        //         ],
        //         [
        //             "channel" => "QR_ONLINE",
        //             "acq" => "WECHAT_PAY"
        //         ],
        //         [
        //             "channel" => "CARD",
        //             "acq" => "BRICC"
        //         ],
        //         [
        //             "channel" => "INSTALLMENT",
        //             "acq" => "BRICC",
        //             "tenor" => [3, 6, 12]
        //         ]
        //     ],
        //     'callback_url' => route('callback'),
        //     'success_redirect_url' => route("home"),
        //     'failed_redirect_url' => route("home"),
        // ];

        // $paymentGatewayResponse = $this->paymentGateway->redirectPayment($paymentGatewayPayload);

        // if ($paymentGatewayResponse['response_code'] !== "00") {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Failed to create transaction. Please try again later.',
        //         'error' => $paymentGatewayResponse['Message'] ?? 'Unknown error',
        //     ], 500);
        // }

        // return Inertia::location($paymentGatewayResponse['data']['payment_url']);
        // return response()->json([
        //     'success' => true,
        //     'redirect_url' => $paymentGatewayResponse['data']['payment_url'],
        // ]);
    }

    public function callback(Request $request)
    {
        $data = session('dummy_payment') ? session('payload') : $request->all();

        // dd($data);

        if (!isset($data['status']) || $data['status'] !== 'SUCCESS') {
            return response()->json(['success' => false, 'message' => 'Payment not successful'], 400);
        }

        DB::beginTransaction();
        try {
            $hTrans = HTrans::create([
                'external_id'      => $data['external_id'] ?? ('INV-' . now()->timestamp),
                'payment_ref'      => $data['payment_ref'] ?? null,
                'total_amount'     => $data['total'] ?? 0,
                'status'           => 'PAID',
                'payment_channel'  => 'DUMMY_GATEWAY',
                'customer_name'    => $data['name'] ?? 'Unknown',
                'customer_email'   => $data['email'] ?? null,
                'customer_address' => $data['address'] ?? null,
                'topup_data'       => json_encode($data['topup_data'] ?? []),
            ]);

            $package = Package::findOrFail($data['package_id']);
            $quantity = (int) $data['quantity'];

            $dTrans = DTrans::create([
                'h_trans_id'  => $hTrans->id,
                'package_id'  => $package->id,
                'qty'         => $quantity,
                'unit_price'  => $package->price,
                'subtotal'    => $package->price * $quantity,
                'status'      => 'WAITING',
            ]);

            $vouchers = Voucher::where('package_id', $package->id)
                ->whereNull('used_at')
                ->lockForUpdate()
                ->limit($quantity)
                ->get();

            if ($vouchers->count() < $quantity) {
                throw new \Exception("Insufficient voucher stock for package: {$package->name}");
            }

            foreach ($vouchers as $voucher) {
                DTransVoucher::create([
                    'd_trans_id' => $dTrans->id,
                    'voucher_id' => $voucher->id,
                    'assigned_at' => now(),
                ]);

                $voucher->update(['used_at' => now()]);
            }

            DB::commit();

            return Inertia::render('');
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Transaction failed.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
