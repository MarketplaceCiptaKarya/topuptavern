import InputWithPlusMinusButtons from '@/components/input-with-plus-minus-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VoucherCard from '@/components/voucher-card';
import MainLayout from '@/layouts/layout';
import { SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { GemIcon, TagIcon } from 'lucide-react';

type DetailVoucherProps = {
    voucherTitle: string;
    voucherCompany: string;
    image: string;
    alt: string;
} & SharedData;

export default function DetailVoucher({
    voucherTitle = 'Steam',
    voucherCompany = 'Valve',
    image = 'https://assets.mabartopup.id/category/steam-wallet-code-V3Gn-rVN8.jpg',
    alt = 'steam',
}: DetailVoucherProps) {
    return (
        <>
            <Head title={voucherTitle}></Head>
            <MainLayout>
                <div className="container mx-auto my-4 space-y-4 px-4">
                    <div className="w-full">
                        <Card className="flex flex-row items-center gap-4 px-6">
                            <div className="inline-flex size-28 shrink-0 items-center justify-center border md:size-32 lg:size-44">
                                <img src={image} alt={alt} className="size-fit" />
                            </div>
                            <div className="flex grow flex-col gap-2">
                                <span className="text-2xl font-bold">{voucherTitle}</span>
                                <span className="text-lg font-semibold">{voucherCompany}</span>
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
                            {Array.from({ length: 100 }).map((_, i) => (
                                <VoucherCard
                                    key={i}
                                    voucherName="Nama voucher asdasd Lorem ipsum dolor sit amet."
                                    voucherPrice={10000000}
                                    isSelected={i % 2 === 0}
                                    disabled={i % 2 !== 0}
                                />
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
