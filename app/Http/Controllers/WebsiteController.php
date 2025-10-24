<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPaymentJob;
use App\Models\DTrans;
use App\Models\Game;
use App\Models\HTrans;
use App\Models\Package;
use App\Models\StaticWebsiteDatum;
use App\Models\Voucher;
use App\PaymentGateway\PaymentGateway;
use Carbon\Carbon;
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
        $validated = \Validator::make($request->only([
            'address',
            'email',
            'name',
            'quantity',
            'selected_voucher_id',
            'topup_data',
        ]), [
            'address' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'name' => 'required|string|max:100',
            'quantity' => 'required|integer|min:1',
            'selected_voucher_id' => 'required|exists:packages,id',
            'topup_data' => 'nullable|array',
        ]);

        if ($validated->fails()) {
            return redirect()->back()->withErrors($validated)->withInput();
        }
        $data = $validated->validated();

        $package = Package::query()->find($data['selected_voucher_id']);
        $quantity = (int)$data['quantity'];
        $total = $package->price * $quantity;

        try {
            DB::beginTransaction();
            $externalId = 'INV-' . str(time()) . '-' . rand(1000, 9999);
            $orderId = 'ORDER-' . str(time()) . '-' . rand(1000, 9999);

            $hTrans = HTrans::create([
                'external_id' => $externalId,
                'total_amount' => $total,
                'customer_name' => $data['name'],
                'customer_email' => $data['email'],
                'customer_address' => $data['address'],
                'topup_data' => $data['topup_data'],
                'transaction_date' => Carbon::now()
            ]);

            DTrans::create([
                'h_trans_id' => $hTrans->id,
                'package_id' => $package->id,
                'qty' => $quantity,
                'unit_price' => $package->price,
                'subtotal' => $package->price * $quantity,
            ]);

            $vouchers = Voucher::where('package_id', $package->id)
                ->whereNull('used_at')
                ->lockForUpdate()
                ->limit($quantity)
                ->get();

            if ($vouchers->count() < $quantity) {
                throw new \Exception("Insufficient voucher stock for package: {$package->name}");
            }

            $paymentGatewayPayload = [
                'external_id' => $externalId,
                'order_id' => $orderId,
                'amount' => $total,
                'description' => 'Transaction for ' . $data['email'],
                'customer_details' => [
                    'full_name' => $data['name'],
                    'email' => $data['email'],
                    'address' => $data['address'],
                ],
                'selected_channels' => [
                    [
                        "channel" => "VA",
                        "acq" => "BCA"
                    ],
                    [
                        "channel" => "VA",
                        "acq" => "CIMB"
                    ],
                    [
                        "channel" => "VA",
                        "acq" => "Permata"
                    ],
                    [
                        "channel" => "VA",
                        "acq" => "MANDIRI"
                    ],
                    [
                        "channel" => "VA",
                        "acq" => "BNI"
                    ],
                    [
                        "channel" => "VA",
                        "acq" => "BRI"
                    ],
                    [
                        "channel" => "VA",
                        "acq" => "BNC"
                    ],
                    [
                        "channel" => "VA",
                        "acq" => "Finpay"
                    ],
                    [
                        "channel" => "OVO"
                    ],
                    [
                        "channel" => "DANA"
                    ],
                    [
                        "channel" => "LINKAJA"
                    ],
                    [
                        "channel" => "SHOPEEPAY"
                    ],
                    [
                        "channel" => "VIRGO"
                    ],
                    [
                        "channel" => "QRIS",
                        "acq" => "NOBU"
                    ],
                    [
                        "channel" => "QR_ONLINE",
                        "acq" => "WECHAT_PAY"
                    ],
                    [
                        "channel" => "CARD",
                        "acq" => "BRICC"
                    ],
                    [
                        "channel" => "INSTALLMENT",
                        "acq" => "BRICC",
                        "tenor" => [3, 6, 12]
                    ]
                ],
                'callback_url' => route('callback'),
                'success_redirect_url' => route("home"),
                'failed_redirect_url' => route("home"),
            ];

            $paymentGatewayResponse = $this->paymentGateway->redirectPayment($paymentGatewayPayload);

            if ($paymentGatewayResponse['response_code'] !== "00") {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create transaction. Please try again later.',
                    'error' => $paymentGatewayResponse['Message'] ?? 'Unknown error',
                ], 500);
            }

            $hTrans->update([
               'payment_url' => $paymentGatewayResponse['data']['payment_url'],
               'payment_transaction_id' => $paymentGatewayResponse['data']['transaction_id'],
            ]);

            DB::commit();

            return Inertia::location($paymentGatewayResponse['data']['payment_url']);
        } catch (\Exception $e) {
            \DB::rollBack();
            return redirect()->back()->withErrors([
                'message' => 'Failed to create transaction. Please try again later.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function callback(Request $request)
    {
        ProcessPaymentJob::dispatch([
            'body' => $request->only([
                'transaction_id',
                'external_id',
                'order_id',
                'transaction_status',
            ]),
            'headers' => collect($request->headers->all())
                ->map(function ($values) {
                    return implode(', ', $values);
                })
                ->toArray(),
        ]);

        return response()->json(['success' => true], 200);
    }

    public function postCheckTransaction(Request $request)
    {
        $validator = \Validator::make($request->only([
            'invoice_number'
        ]), [
            'invoice_number' => 'required|string|exists:h_trans,external_id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        $transaction = HTrans::query()
            ->where('external_id', $data['invoice_number'])
            ->firstOrFail();

        return Inertia::render('check-transaction', [
            'invoice' => [
                'invoce_number' => $transaction->external_id,
                'transaction_status' => match ($transaction->status) {
                    'PENDING' => 'pending',
                    'PAID' => 'success',
                    default => 'failed',
                },
                'payment_status' => match ($transaction->status) {
                    'PENDING' => 'unpaid',
                    'PAID' => 'paid',
                    default => 'expired',
                },
                'payment_link' => $transaction->payment_url,
            ]
        ]);
    }
}
