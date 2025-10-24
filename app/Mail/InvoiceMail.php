<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    private array $invoice;

    /**
     * Create a new message instance.
     */
    public function __construct(array $invoice)
    {
        $this->invoice = $invoice;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Topup Tavern Invoice' . ' ' . $this->invoice['invoice_number'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'invoice',
            with: [
                'name' => $this->invoice['name'],
                'invoice_number' => $this->invoice['invoice_number'],
                'invoice_date' => $this->invoice['invoice_date'],
                'invoice_amount' => 'Rp' . number_format($this->invoice['invoice_amount'], 0, ',', '.'),
                'invoice_status' => $this->invoice['invoice_status'],
                'purchased_code' => $this->invoice['purchased_code'],
                'current_year' => Carbon::now()->format('Y'),
                'support_url' => 'mailto:support@topuptavern.com'
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
