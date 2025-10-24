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
    topup_data?: Record<string, string>;
    selected_voucher_id: string;
    quantity: number;
};

export default function DetailVoucher({ game: { name, logo, company, how_to, topup_data, category_voucher } }: DetailVoucherProps) {
    const id = useId();
    const emailId = useId();
    const nameId = useId();
    const addressId = useId();

    const [total, setTotal] = useState<number>(0);
    const { setData, data, post, errors } = useForm<BuyVoucherForm>({
        email: '',
        name: '',
        address: '',
        selected_voucher_id: '',
        quantity: 1,
    });

    useEffect(() => {
        const voucherPrice =
            category_voucher.flatMap((category) => category.packages).find((pkg) => pkg?.id === data.selected_voucher_id)?.price || 0;
        setTotal(voucherPrice * data.quantity);
    }, [data.selected_voucher_id, data.quantity, category_voucher]);

    const toggleSelectedId = (id: string) => {
        if (data.selected_voucher_id === id) {
            setData('selected_voucher_id', '');
        } else {
            setData('selected_voucher_id', id);
        }
    };

    const purchaseVoucher = async () => {
        post(route('payment'), {
            preserveScroll: true,
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
                                            value={data?.topup_data?.[titleCaseToSnakeCase(topupData)] ?? ''}
                                            onChange={(e) =>
                                                setData('topup_data', {
                                                    ...data.topup_data,
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
                                <div className="min-w-[250px] flex-1 space-y-2">
                                    <Label htmlFor={emailId} className="gap-1">
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id={emailId}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        type="email"
                                        placeholder="Email address"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">Email digunakan untuk pengiriman voucher dan bukti transaksi</p>
                                    <span className="text-sm text-destructive">{errors.email}</span>
                                </div>
                                <div className="min-w-[200px] flex-1 space-y-2">
                                    <Label htmlFor={nameId} className="gap-1">
                                        Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id={nameId}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        type="text"
                                        placeholder="Name"
                                        required
                                    />
                                    <span className="text-sm text-destructive">{errors.name}</span>
                                </div>
                                <div className="min-w-[200px] flex-1 space-y-2">
                                    <Label htmlFor={addressId} className="gap-1">
                                        Address <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id={addressId}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        type="text"
                                        placeholder="Address"
                                        required
                                    />
                                    <span className="text-sm text-destructive">{errors.address}</span>
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
                                    {category.packages?.map((pkg) => (
                                        <VoucherCard
                                            key={pkg.id}
                                            voucherName={pkg.name}
                                            voucherPrice={pkg.price}
                                            onClick={() => toggleSelectedId(pkg.id)}
                                            isSelected={data.selected_voucher_id === pkg.id}
                                            disabled={pkg.quantity < data.quantity || pkg.quantity < 1}
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
                                maxValue={
                                    category_voucher.flatMap((pkg) => pkg.packages).find((p) => p?.id === data.selected_voucher_id)?.quantity || 9999
                                }
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
