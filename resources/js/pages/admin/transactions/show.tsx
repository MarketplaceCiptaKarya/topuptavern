import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { currencyFormatter } from '@/lib/global';
import TransactionStatusBadge from '@/components/transaction-status-badge';

interface Voucher {
    id: number;
    voucher_id: number;
    assigned_at: string;
    voucher: {
        voucher_code: string;
    };
}

interface DTrans {
    id: number;
    qty: number;
    unit_price: number;
    subtotal: number;
    package?: {
        name: string;
    };
    d_trans_vouchers: Voucher[];
}

interface Transaction {
    id: number;
    external_id: string;
    customer_name: string;
    customer_email: string;
    customer_address: string;
    status: string;
    total_amount: number;
    d_trans: DTrans[];
}

export default function Show({ transaction }: { transaction: Transaction }) {

    const getBadgeStatus = (status: string): 'success' | 'pending' | 'failed' => {
        switch (status) {
            case 'PAID':
                return 'success';
            case 'PENDING':
                return 'pending';
            default:
                return 'failed';
        }
    };
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Transactions Detail : {transaction.external_id}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-[150px_10px_1fr] items-center gap-3">
                        <span className="font-semibold">Invoice</span> <span>:</span> {transaction.external_id}
                        <span className="font-semibold">Customer</span> <span>:</span> {transaction.customer_name}
                        <span className="font-semibold">Email</span> <span>:</span> {transaction.customer_email}
                        <span className="font-semibold">Address</span> <span>:</span> {transaction.customer_address}
                        <span className="font-semibold">Status</span>
                        <span>:</span>
                        <div className="flex items-center gap-2">
                            <TransactionStatusBadge status={getBadgeStatus(transaction.status)} text={transaction.status} />
                        </div>
                        <span className="font-semibold">Total</span> <span>:</span> {currencyFormatter.format(transaction.total_amount)}
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Packages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full overflow-x-auto">
                        <Table className="min-w-full table-fixed">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/3">Package Name</TableHead>
                                    <TableHead className="w-1/6 text-center">Qty</TableHead>
                                    <TableHead className="w-1/6 text-right">Price</TableHead>
                                    <TableHead className="w-1/6 text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transaction.d_trans.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell>{d.package?.name}</TableCell>
                                        <TableCell className="text-center">{d.qty}</TableCell>
                                        <TableCell className="text-right">
                                            {currencyFormatter.format(d.unit_price)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {currencyFormatter.format(d.subtotal)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Voucher</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full overflow-x-auto">
                        <Table className="min-w-full table-fixed">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/3">Package</TableHead>
                                    <TableHead className="w-1/3">Voucher Code</TableHead>
                                    <TableHead className="w-1/3">Assigned At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transaction.d_trans.flatMap((d) =>
                                    d.d_trans_vouchers.map((v) => (
                                        <TableRow key={v.voucher_id}>
                                            <TableCell>{d.package?.name}</TableCell>
                                            <TableCell>{v.voucher.voucher_code}</TableCell>
                                            <TableCell>
                                                {new Date(v.assigned_at).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

Show.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
