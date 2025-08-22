import TransactionStatusBadge from '@/components/transaction-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/layouts/layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, FileSearch2 } from 'lucide-react';
import { useId } from 'react';

export default function CheckTransaction() {
    const id = useId();
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
                                        <Input id={id} type="text" placeholder="ex. INV00001" required />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" variant="outline" className="w-full">
                                    <FileSearch2 />
                                    Search Invoice
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                    <Card className="w-full max-w-lg rounded-2xl">
                        <CardHeader>
                            <CardTitle>Invoice INV0001</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-[150px_10px_1fr] items-center gap-3">
                                    <span>Transaction Status</span>
                                    <span>:</span>
                                    <TransactionStatusBadge status="success" />

                                    <span>Payment Status</span>
                                    <span>:</span>
                                    <TransactionStatusBadge status="success" text="Paid" />

                                    <span className="col-span-3">
                                        <Button asChild variant="outline" className="group">
                                            <Link href="#">
                                                Go to Payment Page
                                                <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                            </Link>
                                        </Button>
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        </>
    );
}
