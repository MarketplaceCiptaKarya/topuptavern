<?php

namespace App\Jobs;

use App\Models\DTrans;
use App\Models\DTransVoucher;
use App\Models\HTrans;
use App\Models\Package;
use App\Models\Voucher;
use App\PaymentGateway\IFortepayImpl;
use App\PaymentGateway\PaymentGateway;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPaymentJob implements ShouldQueue
{
    use Queueable;

    private array $payload;
    private array $headers;

    /**
     * Create a new job instance.
     */
    public function __construct(array $payload)
    {
        $this->payload = $payload['body'] ?? [];
        $this->headers = $payload['headers'] ?? [];
    }

    /**
     * Execute the job.
     */
    public function handle(PaymentGateway $paymentGateway): void
    {
        if ($paymentGateway instanceof IFortepayImpl) {
            $validSignature = $paymentGateway->isValidsignature($this->headers['mcp-signature'], $this->payload['transaction_id'], $this->payload['external_id'], $this->payload['order_id']);

            if (!$validSignature) {
                throw new \Exception('Invalid signature for transaction: ' . $this->payload['external_id']);
            }
        }

        $transactionCheck = $paymentGateway->check($this->payload['transaction_id']);

        try {
            \DB::beginTransaction();
            $transaction = HTrans::query()
                ->where('external_id', $this->payload['external_id'])
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                throw new \Exception('Transaction not found: ' . $this->payload['external_id']);
            }

            if (
                $transaction->status === 'PAID' ||
                $transaction->status === 'EXPIRED' ||
                $transaction->status === 'FAILED'
            ){
                return;
            }

            $transaction->status = match ($transactionCheck['transaction_status']) {
                'PAID', 'SUCCESS' => 'PAID',
                'ACTIVE', 'REQUEST', 'PROCESSING' => 'PENDING',
                'FAILED', 'CANCELLED', 'VOID' => 'FAILED',
                'EXPIRED' => 'EXPIRED',
                default => throw new \Exception('Unknown transaction status: ' . $this->payload['transaction_status']),
            };

            $dTrans = DTrans::query()
                ->where('h_trans_id', $transaction->id)
                ->first();

            $package = Package::query()
                ->lockForUpdate()
                ->find($dTrans->package_id);

            $quantity = $dTrans->qty;
            $package->quantity = $package->quantity - $quantity;

            $vouchers = Voucher::where('package_id', $package->id)
                ->whereNull('used_at')
                ->lockForUpdate()
                ->limit($quantity)
                ->get();

            foreach ($vouchers as $voucher) {
                DTransVoucher::create([
                    'd_trans_id' => $dTrans->id,
                    'voucher_id' => $voucher->id,
                    'assigned_at' => now(),
                ]);

                $voucher->update(['used_at' => now()]);
            }

            $package->save();
            $transaction->save();

            \DB::commit();
        }
        catch (\Exception $e) {
            \DB::rollBack();
            throw new \Exception('Failed to process payment: ' . $e->getMessage(), 0, $e);
        }
    }
}
