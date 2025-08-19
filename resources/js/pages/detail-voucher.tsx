import InputWithPlusMinusButtons from '@/components/input-with-plus-minus-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import VoucherCard from '@/components/voucher-card';
import MainLayout from '@/layouts/layout';
import { SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { GemIcon, TagIcon } from 'lucide-react';
import { Fragment, useId } from 'react';

type DetailVoucherProps = {
    gameTitle: string;
    gameCompany: string;
    gameImage: string;
    gameAltImage: string;
    orderInstructions?: string;
    orderData?: string[];
    categories: {
        id: string;
        name?: string;
        packages: {
            id: string;
            name: string;
            price: number;
            quantity: number;
        }[];
    }[];
} & SharedData;

export default function DetailVoucher({
    gameTitle = 'Steam',
    gameCompany = 'Valve',
    gameImage = 'https://assets.mabartopup.id/category/steam-wallet-code-V3Gn-rVN8.jpg',
    gameAltImage = 'steam',
    orderInstructions = '<p>1. Pilih kategori voucher yang diinginkan.</p><p>2. Pilih paket voucher yang sesuai.</p><p>3. Isi data pemesan dan email untuk pengiriman voucher.</p><p>4. Tentukan jumlah pembelian.</p><p>5. Klik tombol "Process to Payment" untuk melanjutkan ke pembayaran.</p>',
    orderData = ['user id', 'zone id'],
    categories = [
        {
            id: '1',
            name: 'Steam Wallet',
            packages: [
                {
                    id: '1',
                    name: 'Steam Wallet 100k',
                    price: 100000,
                    quantity: 1,
                },
                {
                    id: '2',
                    name: 'Steam Wallet 200k',
                    price: 200000,
                    quantity: 1,
                },
            ],
        },
        {
            id: '2',
            name: 'Google Play',
            packages: [
                {
                    id: '3',
                    name: 'Google Play 50k',
                    price: 50000,
                    quantity: 1,
                },
                {
                    id: '4',
                    name: 'Google Play 100k',
                    price: 100000,
                    quantity: 1,
                },
            ],
        },
    ],
}: DetailVoucherProps) {
    const id = useId();
    return (
        <>
            <Head title={gameTitle}></Head>
            <MainLayout>
                <div className="container mx-auto my-4 space-y-4 px-4">
                    <div className="w-full">
                        <Card className="flex flex-row items-center gap-4 px-6">
                            <div className="inline-flex size-28 shrink-0 items-center justify-center border md:size-32 lg:size-44">
                                <img src={gameImage} alt={gameAltImage} className="size-fit" />
                            </div>
                            <div className="flex grow flex-col gap-2">
                                <span className="text-2xl font-bold">{gameTitle}</span>
                                <span className="text-lg font-semibold">{gameCompany}</span>
                            </div>
                        </Card>
                    </div>
                    {orderInstructions && (
                        <div className="w-full">
                            <Card className="flex flex-row items-center gap-4 px-6">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="how-to-order">
                                        <AccordionTrigger className="pt-0 font-bold data-[state=closed]:pb-0">How to order</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            <div
                                                className="h-full w-full"
                                                dangerouslySetInnerHTML={{
                                                    __html: orderInstructions,
                                                }}
                                            ></div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        </div>
                    )}
                    {orderData?.length > 0 && (
                        <div className="w-full">
                            <Card className="flex flex-row flex-wrap items-center gap-4 px-6">
                                {orderData.map((data, index) => (
                                    <div key={index + '-' + data} className="w-full max-w-xs space-y-2">
                                        <Label htmlFor={id + '-' + index + '-' + data} className="gap-1">
                                            {data}
                                        </Label>
                                        <Input id={id + '-' + index + '-' + data} type="text" placeholder={data} />
                                    </div>
                                ))}
                            </Card>
                        </div>
                    )}
                    <div className="w-full">
                        <Card className="flex flex-row items-center gap-4 px-6">
                            <div className="w-full max-w-xs space-y-2">
                                <Label htmlFor={id} className="gap-1">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input id={id} type="email" placeholder="Email address" required />
                                <p className="text-xs text-muted-foreground">Email digunakan untuk pengiriman voucher dan bukti transaksi</p>
                            </div>
                        </Card>
                    </div>
                    <div className="flex w-full flex-col gap-4 md:flex-row">
                        <Card className="grid grow grid-cols-2 px-6 lg:grid-cols-3 xl:grid-cols-4">
                            <div className="col-span-full flex flex-col gap-1">
                                <span className="inline-flex items-center gap-2 text-lg font-bold">
                                    <GemIcon />
                                    Voucher Amount
                                </span>
                                <span className="text-sm text-muted-foreground">Select the voucher you want to purchase</span>
                            </div>
                            {categories.map((category) => (
                                <Fragment key={category.id}>
                                    {category.name && (
                                        <div className="col-span-full">
                                            <span className="font-semibold">{category.name}</span>
                                        </div>
                                    )}
                                    {category.packages.map((pkg) => (
                                        <VoucherCard
                                            key={pkg.id}
                                            voucherName={pkg.name}
                                            voucherPrice={pkg.price}
                                            isSelected={false}
                                            disabled={false}
                                        />
                                    ))}
                                </Fragment>
                            ))}
                        </Card>
                        <Card className="sticky top-auto bottom-3 h-fit shrink-0 px-6 md:top-3 md:bottom-auto">
                            <InputWithPlusMinusButtons defaultValue={1} label="Purchase Quantity" minValue={1} locale="id-ID" />
                            <span className="text-lg font-bold">Total: </span>
                            <Button variant="outline">
                                <TagIcon />
                                Process to Payment
                            </Button>
                        </Card>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
