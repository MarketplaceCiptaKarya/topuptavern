<!DOCTYPE html>
<html lang="en" style="font-family: Arial, sans-serif; background-color: #000000; margin: 0; padding: 0;">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice Confirmation</title>

    <style>
        /* MOBILE STYLES */
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                padding: 16px !important;
            }
            .content {
                padding: 16px !important;
            }
            h1 {
                font-size: 20px !important;
            }
            h3 {
                font-size: 18px !important;
            }
            p,
            td {
                font-size: 14px !important;
            }
            .code-box {
                font-size: 18px !important;
                word-break: break-all !important;
            }
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #000000;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center" style="padding: 24px;">
            <table
                class="container"
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
              width: 600px;
              max-width: 100%;
              background-color: #262626;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            "
            >
                <!-- Header -->
                <tr>
                    <td
                        style="
                  background-color: #e59a2f;
                  color: #000000;
                  text-align: center;
                  padding: 24px 16px;
                "
                    >
                        <h1 style="margin: 0; font-size: 24px;">Top-up Invoice</h1>
                    </td>
                </tr>

                <!-- Greeting -->
                <tr>
                    <td class="content" style="padding: 24px;">
                        <p style="font-size: 16px; color: #ffffff; margin: 0 0 8px;">
                            Hi <strong>{{ $name }}</strong>,
                        </p>
                        <p style="font-size: 16px; color: #d1d5db; margin: 0;">
                            Thank you for your purchase! Here are your transaction details:
                        </p>
                    </td>
                </tr>

                <!-- Transaction Details -->
                <tr>
                    <td class="content" style="padding: 0 24px;">
                        <table
                            width="100%"
                            cellpadding="8"
                            cellspacing="0"
                            role="presentation"
                            style="border-collapse: collapse;"
                        >
                            <tr>
                                <td style="color: #9ca3af; width: 40%;">Order ID:</td>
                                <td style="color: #ffffff; font-weight: 600;">
                                    {{ $invoice_number }}
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #9ca3af;">Transaction Date:</td>
                                <td style="color: #ffffff; font-weight: 600;">
                                    {{ $invoice_date }}
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #9ca3af;">Amount:</td>
                                <td style="color: #ffffff; font-weight: 600;">
                                    {{ $invoice_amount }}
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #9ca3af;">Status:</td>
                                <td style="color: #10b981; font-weight: 600;">
                                    {{ $invoice_status }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Divider -->
                <tr>
                    <td style="padding: 16px 24px;">
                        <hr style="border: none; border-top: 1px solid #444;" />
                    </td>
                </tr>

                <!-- Purchased Code -->
                <tr>
                    <td class="content" style="padding: 0 24px 24px;">
                        <h3 style="margin-bottom: 8px; color: #ffffff;">Your Code</h3>
                        @if(is_array($purchased_code))
                            @foreach($purchased_code as $code)
                                <p
                                    class="code-box"
                                    style="
                background-color: #111;
                border: 1px dashed #7188f9;
                border-radius: 8px;
                padding: 12px;
                font-size: 20px;
                letter-spacing: 2px;
                text-align: center;
                color: #f9f871;
                font-weight: bold;
                margin: 0 0 8px;
                word-break: break-word;
            "
                                >
                                    {{ $code }}
                                </p>
                            @endforeach
                        @else
                            <p
                                class="code-box"
                                style="
            background-color: #111;
            border: 1px dashed #7188f9;
            border-radius: 8px;
            padding: 12px;
            font-size: 20px;
            letter-spacing: 2px;
            text-align: center;
            color: #f9f871;
            font-weight: bold;
            margin: 0 0 8px;
            word-break: break-word;
        "
                            >
                                {{ $purchased_code }}
                            </p>
                        @endif
                        <p
                            style="
                    font-size: 14px;
                    color: #9ca3af;
                    text-align: center;
                    margin: 0;
                  "
                        >
                            Use this code to redeem your balance.
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td
                        style="
                  background-color: #000000;
                  color: #9ca3af;
                  text-align: center;
                  font-size: 14px;
                  padding: 16px 24px;
                "
                    >
                        <p style="margin: 0;">
                            Need help?
                            <a
                                href="{{ $support_url }}"
                                style="color: #7188f9; text-decoration: none;"
                            >Contact Support</a
                            ><br />
                            © {{ $current_year }} Topup Tavern. All rights reserved.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
