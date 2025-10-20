import InputWithPlusMinusButtons from '@/components/input-with-plus-minus-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import VoucherCard from '@/components/voucher-card';
import MainLayout from '@/layouts/layout';
import { currencyFormatter, titleCaseToSnakeCase } from '@/lib/global';
import { Game, SharedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { GemIcon, TagIcon } from 'lucide-react';
import { Fragment, useEffect, useId, useState } from 'react';

type DetailVoucherProps = {
    game: Game;
} & SharedData;

type BuyVoucherForm = {
    email: string;
    name: string;
    address: string;
    topupData?: Record<string, string>;
    selectedVoucherId: string;
    quantity: number;
    total: number;
};

export default function DetailVoucher({ game: { name, logo, company, how_to, topup_data, category_voucher } }: DetailVoucherProps) {
    const id = useId();
    const [total, setTotal] = useState<number>(0);
    const { setData, data, post, processing, errors } = useForm<BuyVoucherForm>({
        email: '',
        name: '',
        address: '',
        selectedVoucherId: '',
        quantity: 1,
        total: total,
    });

    useEffect(() => {
        const voucherPrice = category_voucher.flatMap((category) => category.packages).find((pkg) => pkg.id === data.selectedVoucherId)?.price || 0;
        setTotal(voucherPrice * data.quantity);

        const newTotal = voucherPrice * data.quantity;
        setTotal(newTotal);
        setData("total", newTotal);
    }, [data.selectedVoucherId, data.quantity, category_voucher]);

    const toggleSelectedId = (id: string) => {
        if (data.selectedVoucherId === id) {
            setData('selectedVoucherId', '');
        } else {
            setData('selectedVoucherId', id);
        }
    };

    const purchaseVoucher = async () => {
        // try {
        //     const response = await fetch(route('payment'), {
        //         method: 'POST',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //             'X-CSRF-TOKEN': document
        //                 .querySelector('meta[name="csrf-token"]')
        //                 ?.getAttribute('content') ?? '',
        //         },
        //     });

        //     const result = await response.json();
        //     if (result.success && result.url) {
        //         window.location.href = result.url; // Redirect to iFortepay page
        //     } else {
        //         alert(result.message || 'Payment initialization failed');
        //     }
        // } catch (error) {
        //     console.error(error);
        //     alert('Error connecting to payment gateway');
        // }
        console.log(data);
        post(route('payment'), {
            preserveScroll: true,
            onSuccess: (page) => {
                const url = page.props?.url; // assuming backend returns url in props
                if (url) {
                    window.location.href = url;
                } else {
                    alert('Payment URL not found');
                }
            },
            onError: (err) => {
                console.error('Payment error:', err);
                alert('Payment failed. Please check your data or try again.');
            },
        });
    };


    return (
        <>
            <Head title={name}></Head>
            <MainLayout>
                <div className="container mx-auto my-4 space-y-4 px-4">
                    <div className="w-full">
                        <Card className="flex flex-row items-center gap-4 px-6">
                            <div className="inline-flex size-28 shrink-0 items-center justify-center border md:size-32 lg:size-44">
                                <img src={logo} alt={`Logo ${name}`} className="size-fit" />
                            </div>
                            <div className="flex grow flex-col gap-2">
                                <span className="text-2xl font-bold">{name}</span>
                                <span className="text-lg font-semibold">{company}</span>
                            </div>
                        </Card>
                    </div>
                    {how_to && (
                        <div className="w-full">
                            <Card className="flex flex-row items-center gap-4 px-6">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="how-to-order">
                                        <AccordionTrigger className="pt-0 font-bold data-[state=closed]:pb-0">How to order</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            <div
                                                className="reset-defaults h-full w-full"
                                                dangerouslySetInnerHTML={{
                                                    __html: how_to,
                                                }}
                                            ></div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        </div>
                    )}
                    {topup_data?.length > 0 && (
                        <div className="w-full">
                            <Card className="flex flex-row flex-wrap items-center gap-4 px-6">
                                {topup_data.map((topupData, index) => (
                                    <div key={index + '-' + topupData} className="w-full max-w-xs space-y-2">
                                        <Label htmlFor={id + '-' + index + '-' + topupData} className="gap-1">
                                            {topupData}
                                        </Label>
                                        <Input
                                            id={id + '-' + index + '-' + topupData}
                                            value={data?.topupData?.[titleCaseToSnakeCase(topupData)] ?? ''}
                                            onChange={(e) =>
                                                setData('topupData', {
                                                    ...data.topupData,
                                                    [titleCaseToSnakeCase(topupData)]: e.target.value,
                                                })
                                            }
                                            type="text"
                                            placeholder={topupData}
                                        />
                                    </div>
                                ))}
                            </Card>
                        </div>
                    )}
                    <div className="w-full">
                        <Card className="px-6 py-4">
                            <div className="flex flex-wrap items-start gap-4">
                                <div className="flex-1 min-w-[250px] space-y-2">
                                    <Label htmlFor="email" className="gap-1">
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        type="email"
                                        placeholder="Email address"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email digunakan untuk pengiriman voucher dan bukti transaksi
                                    </p>
                                </div>
                                <div className="flex-1 min-w-[200px] space-y-2">
                                    <Label htmlFor="name" className="gap-1">
                                        Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        type="text"
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px] space-y-2">
                                    <Label htmlFor="address" className="gap-1">
                                        Address <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        type="text"
                                        placeholder="Address"
                                        required
                                    />
                                </div>
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
                            {category_voucher.map((category) => (
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
                                            onClick={() => toggleSelectedId(pkg.id)}
                                            isSelected={data.selectedVoucherId === pkg.id}
                                            disabled={false}
                                        />
                                    ))}
                                </Fragment>
                            ))}
                        </Card>
                        <Card className="sticky top-auto bottom-3 h-fit shrink-0 px-6 md:top-3 md:bottom-auto">
                            <InputWithPlusMinusButtons
                                value={data.quantity}
                                onChange={(qty) => setData('quantity', qty)}
                                label="Purchase Quantity"
                                minValue={1}
                                locale="id-ID"
                            />
                            <span className="text-lg font-bold">Total: {currencyFormatter.format(total)}</span>
                            <Button variant="outline" onClick={() => purchaseVoucher()}>
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
