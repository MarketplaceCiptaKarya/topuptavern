import TransactionStatusBadge from '@/components/transaction-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/layouts/layout';
import { toTitleCase } from '@/lib/global';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRightIcon, FileSearch2 } from 'lucide-react';
import { useId } from 'react';

type CheckTransactionForm = {
    invoice_number: string;
};

type CheckTransactionProps = {
    invoice?: {
        invoce_number: string;
        transaction_status: 'pending' | 'success' | 'failed';
        payment_status: 'unpaid' | 'paid' | 'expired';
        payment_link: string;
    };
};

export default function CheckTransaction({ invoice }: CheckTransactionProps) {
    const id = useId();
    const { post, data, setData } = useForm<CheckTransactionForm>({
        invoice_number: '',
    });

    const handleSubmit = () => {
        post(route('check-transaction.post'));
    };

    return (
        <>
            <Head title="Check Transaction"></Head>
            <MainLayout>
                <div className="container mx-auto my-4 flex flex-col items-center justify-center gap-4 px-4">
                    <form className="w-full max-w-lg">
                        <Card className="rounded-2xl">
                            <CardHeader className="text-center">
                                <CardTitle>Easily and Quickly Check Your Invoice</CardTitle>
                                <CardDescription>View your purchase details using the Invoice number</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor={id}>Invoice Number</Label>
                                        <Input
                                            id={id}
                                            type="text"
                                            placeholder="ex. INV-1111111111-1111"
                                            value={data.invoice_number}
                                            onChange={(e) => setData('invoice_number', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="button" onClick={() => handleSubmit()} variant="outline" className="w-full">
                                    <FileSearch2 />
                                    Search Invoice
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                    {invoice && (
                        <>
                            <Card className="w-full max-w-lg rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Invoice {invoice.invoce_number}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-3">
                                        <div className="grid grid-cols-[150px_10px_1fr] items-center gap-3">
                                            <span>Transaction Status</span>
                                            <span>:</span>
                                            <TransactionStatusBadge status={invoice.transaction_status} />

                                            <span>Payment Status</span>
                                            <span>:</span>
                                            <TransactionStatusBadge status={invoice.transaction_status} text={toTitleCase(invoice.payment_status)} />

                                            {invoice.payment_status === 'unpaid' && (
                                                <span className="col-span-3">
                                                    <Button asChild variant="outline" className="group">
                                                        <a href={invoice.payment_link} rel="noopener noreferrer" target="_blank">
                                                            Go to Payment Page
                                                            <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                                        </a>
                                                    </Button>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </MainLayout>
        </>
    );
}
