import InputNumber from "@/components/input-number";
import PreviewMedia from "@/components/preview-media";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/layouts/admin-layout";
import { CategoryVoucher, Game, Package, SharedData } from "@/types";
import { router, useForm, usePage } from '@inertiajs/react';
import { Label } from "@radix-ui/react-label";
import { Plus, Save, Trash2 } from "lucide-react";

type VoucherInput = {
    id: string;
    packageName: string;
    amount: number;
};

export default function EditGames() {
    const { game } = usePage<
        SharedData & {
            game: Game;
        }
    >().props;

    const { submit, setData, data, errors, reset } = useForm({
        game_logo: null as File | null,
        game_name: game.name || "",
        game_company: game.company || "",
        how_to: game.how_to || "",
        topup_data: (() => {
            try {
                return Array.isArray(game.topup_data)
                    ? game.topup_data
                    : JSON.parse(game.topup_data || "[]");
            } catch {
                return [];
            }
        })(),

        vouchers: game.category_voucher?.length
            ? game.category_voucher.map((cv: CategoryVoucher) => ({
                id: cv.id,
                name: cv.name || "",
                inputs: cv.packages?.length
                    ? cv.packages.map((pkg: Package) => ({
                        id: pkg.id,
                        packageName: pkg.name || "",
                        amount: pkg.price || 0,
                    }))
                    : [{ id: crypto.randomUUID(), packageName: "", amount: 0 }],
            }))
            : [{
                id: crypto.randomUUID(),
                name: "",
                inputs: [{ id: crypto.randomUUID(), packageName: "", amount: 0 }],
            }],
    });

    const addVoucher = () => {
        setData('vouchers', [
            ...data.vouchers,
            {
                id: crypto.randomUUID(),
                name: '',
                inputs: [{ id: crypto.randomUUID(), packageName: '', amount: 0 }],
            },
        ]);
    };

    const addTopupField = () => {
        setData("topup_data", [...data.topup_data, ""]);
    };

    const removeTopupField = (index: number) => {
        const newTopup = [...data.topup_data];
        newTopup.splice(index, 1);
        setData("topup_data", newTopup);
    };

    const updateTopupField = (index: number, value: string) => {
        const newFields = [...data.topup_data];
        newFields[index] = value;
        setData("topup_data", newFields);
    };

    const deleteVoucher = (voucherId: string) => {
        setData(
            'vouchers',
            data.vouchers.filter((v) => v.id !== voucherId),
        );
    };

    const updateVoucherName = (voucherId: string, value: string) => {
        setData(
            'vouchers',
            data.vouchers.map((v) => (v.id === voucherId ? { ...v, name: value } : v)),
        );
    };

    const addInput = (voucherId: string) => {
        setData(
            'vouchers',
            data.vouchers.map((v) =>
                v.id === voucherId
                    ? {
                        ...v,
                        inputs: [...v.inputs, { id: crypto.randomUUID(), packageName: '', amount: 0 }],
                    }
                    : v,
            ),
        );
    };

    const updateInput = (
        voucherId: string,
        inputId: string,
        field: "packageName" | "amount",
        value: string | number
    ) => {
        setData(
            "vouchers",
            data.vouchers.map((v) =>
                v.id === voucherId
                    ? {
                        ...v,
                        inputs: v.inputs.map((i: VoucherInput) =>
                            i.id === inputId
                                ? {
                                    ...i,
                                    [field]:
                                        field === "amount" ? Number(value) : (value as string),
                                }
                                : i
                        ),
                    }
                    : v
            )
        );
    };

    const deleteInput = (voucherId: string, inputId: string) => {
        setData(
            "vouchers",
            data.vouchers.map((v) =>
                v.id === voucherId
                    ? { ...v, inputs: v.inputs.filter((i: { id: string; }) => i.id !== inputId) }
                    : v
            )
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...data,
            vouchers: data.vouchers.map((v) => ({
                id: v.id,
                name: v.name,
                inputs: v.inputs.map((i: { id: string; packageName: string; amount: number; }) => ({
                    id: i.id,
                    packageName: i.packageName,
                    amount: Number(i.amount) || 0,
                })),
            })),
        };

        console.log("Form Payload:", payload);

        submit('post', route('admin.games.update', game.id), {
            onSuccess: () => {
                reset();
                router.visit(route('admin.games'));
            },
        });
    };

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Game</CardTitle>
                        <CardDescription>Update this game</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <PreviewMedia
                                initialMedia={
                                    data.game_logo
                                        ? { url: URL.createObjectURL(data.game_logo), file: data.game_logo }
                                        : null
                                }
                                onChange={(newFile) => setData("game_logo", newFile)}
                                error={
                                    Object.keys(errors)
                                        .filter((key) => key.startsWith('game_logo'))
                                        .map((key) => (errors as Record<string, string>)[key])
                                        .join(', ')
                                }
                            />

                            <Input
                                type="text"
                                placeholder="Game Title"
                                value={data.game_name}
                                onChange={(e) => setData('game_name', e.target.value)}
                            />
                            {errors.game_name && <p className="text-sm text-red-500">{errors.game_name}</p>}

                            <Input
                                type="text"
                                placeholder="Game Company"
                                value={data.game_company}
                                onChange={(e) => setData("game_company", e.target.value)}
                            />
                            {errors.game_company && <p className="text-sm text-red-500">{errors.game_company}</p>}

                            <Button type="button" onClick={addTopupField}><Plus /> Add Top Up Data</Button>

                            <div className="space-y-2 mt-3">
                                {data.topup_data.map((field: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Top Up Name"
                                            value={field}
                                            onChange={(e) => updateTopupField(index, e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => removeTopupField(index)}
                                        >
                                            <Trash2 />
                                        </Button>

                                        {(errors as Record<string, string>)[`topup_data.${index}`] && (
                                            <p className="text-sm text-red-500">
                                                {(errors as Record<string, string>)[`topup_data.${index}`]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <br />
                            <Label>How To</Label>
                            <RichTextEditor
                                defaultHtmlValue={data.how_to}
                                onChangeResult={(html) => setData('how_to', html)}
                            />
                            {errors.how_to && <p className="text-sm text-red-500">{errors.how_to}</p>}
                        </div>

                        <div>
                            <Label className="grid w-full max-w-xs items-center gap-3 my-3">
                                Vouchers
                            </Label>

                            {data.vouchers.map((voucher, vIndex) => (
                                <div key={voucher.id} className="border rounded p-3 mb-3 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Input
                                            placeholder="Voucher name (optional)"
                                            value={voucher.name}
                                            onChange={e => updateVoucherName(voucher.id, e.target.value)}
                                        />
                                        {vIndex > 0 && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => deleteVoucher(voucher.id)}
                                            >
                                                <Trash2 /> Delete Voucher
                                            </Button>
                                        )}
                                    </div>

                                    {voucher.inputs.map((input: { id: string; packageName: string; amount: number }, iIndex: number) => (
                                        <div key={input.id} className="flex gap-2 items-center">
                                            <Input
                                                placeholder="Package name"
                                                value={input.packageName}
                                                onChange={e =>
                                                    updateInput(voucher.id, input.id, "packageName", e.target.value)
                                                }
                                            />
                                            <InputNumber
                                                placeholder="Amount"
                                                minValue={0}
                                                value={input.amount}
                                                onChange={(val) => updateInput(voucher.id, input.id, 'amount', val)}
                                            />

                                            {iIndex > 0 && (
                                                <Button
                                                    variant="secondary"
                                                    type="button"
                                                    size="icon"
                                                    onClick={() => deleteInput(voucher.id, input.id)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    <Button type="button" size="sm" onClick={() => addInput(voucher.id)}>
                                        <Plus /> Add Package
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" onClick={addVoucher}><Plus /> Add Voucher</Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit"><Save /> Save</Button>
                    </CardFooter>
                </Card>
            </form>
        </AdminLayout>
    );
}
