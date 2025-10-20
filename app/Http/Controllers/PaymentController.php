<?php


namespace App\Http\Controllers;

use App\PaymentGateway\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    public function create(Request $request, PaymentGateway $paymentGateway)
    {
        try {
            $orderId = 'ORD-' . uniqid();
            $externalId = 'EXT-' . uniqid();

            $payload = [
                'order_id' => $orderId,
                'external_id' => $externalId,
                'amount' => 10000, // example: from your selected voucher
                'customer_email' => $request->email,
                'redirect_url' => route('payment.success'),
                'callback_url' => route('payment.callback'),
            ];

            $response = $paymentGateway->redirectPayment($payload);

            if (isset($response['redirect_url'])) {
                return response()->json([
                    'success' => true,
                    'url' => $response['redirect_url']
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Payment gateway did not return a redirect URL.'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function success()
    {
        return view('payment.success');
    }

    public function cancel()
    {
        return view('payment.cancel');
    }

    public function callback(Request $request)
    {
        // Handle async notification from iFortepay
        // ::info('Payment callback', $request->all());
        return response()->json(['status' => 'ok']);
    }
}
