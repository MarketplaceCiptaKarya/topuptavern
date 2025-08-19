import PreviewMedia from "@/components/custom/preview-media";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/layouts/custom/admin-layout";
import RichTextEditor from "@/layouts/custom/rich-text-editor";
import { router, useForm, usePage } from '@inertiajs/react';
import { Label } from "@radix-ui/react-label";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type VoucherInput = {
    id: string;
    packageName: string;
    amount: number;
};

type Voucher = {
    id: string;
    name: string;
    inputs: VoucherInput[];
};

type TopUpData = {
    id: string;
    name: string;
};

export default function AddGames() {
    const { submit, setData, data, errors, reset } = useForm<{
        logo_game: File | null;
        nama_game: string;
        perusahaan_game: string;
        howTo: string;
        topupData: {
            id: string;
            name: string;
        }[];
        vouchers: {
            id: string;
            name: string;
            inputs: {
                id: string;
                packageName: string;
                amount: number;
            }[];
        }[];
    }>({
        logo_game: null,
        nama_game: "",
        perusahaan_game: "",
        howTo: "",
        topupData: [
            {
                id: crypto.randomUUID(),
                name: "",
            },
        ],
        vouchers: [
            {
                id: crypto.randomUUID(),
                name: "",
                inputs: [{ id: crypto.randomUUID(), packageName: "", amount: 0 }]
            }
        ]
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData("logo_game", e.target.files[0]);
        }
    };

    const addVoucher = () => {
        setData("vouchers", [
            ...data.vouchers,
            {
                id: crypto.randomUUID(),
                name: "",
                inputs: [
                    { id: crypto.randomUUID(), packageName: "", amount: 0 },
                ],
            },
        ]);
    };

    const addTopupData = () => {
        setData("topupData", [
            ...data.topupData,
            { id: crypto.randomUUID(), name: "" },
        ]);
    };

    const updateTopupData = (id: string, value: string) => {
        setData(
            "topupData",
            data.topupData.map(t =>
                t.id === id ? { ...t, name: value } : t
            )
        );
    };

    const deleteTopupData = (id: string) => {
        setData("topupData", data.topupData.filter(t => t.id !== id));
    };

    const deleteVoucher = (voucherId: string) => {
        setData(
            "vouchers",
            data.vouchers.filter((v) => v.id !== voucherId)
        );
    };

    const updateVoucherName = (voucherId: string, value: string) => {
        setData(
            "vouchers",
            data.vouchers.map((v) =>
                v.id === voucherId ? { ...v, name: value } : v
            )
        );
    };

    const addInput = (voucherId: string) => {
        setData(
            "vouchers",
            data.vouchers.map((v) =>
                v.id === voucherId
                    ? {
                        ...v,
                        inputs: [
                            ...v.inputs,
                            { id: crypto.randomUUID(), packageName: "", amount: 0 },
                        ],
                    }
                    : v
            )
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
                        inputs: v.inputs.map((i) =>
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
                    ? { ...v, inputs: v.inputs.filter((i) => i.id !== inputId) }
                    : v
            )
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Combine useForm data + vouchers into one object
        const payload = {
            ...data,
            vouchers: data.vouchers.map(v => ({
                id: v.id,
                name: v.name,
                inputs: v.inputs.map(i => ({
                    id: i.id,
                    packageName: i.packageName,
                    amount: Number(i.amount) || 0,
                })),
            })),
        };

        // Debug log
        console.log("Form Payload:", payload);

        // // If you also want to inspect files individually
        // if (data.logo_game) {
        //     console.log("Uploaded Files:", data.logo_game);
        // }

        submit('post', route('admin.games.store'), {
            onSuccess: () => {
                reset();
                router.visit(route('admin.games'));
            },
        });
    };

    return (
        <>
            <AdminLayout>
                <form onSubmit={handleSubmit} className="w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Game</CardTitle>
                            <CardDescription>Fill this form to add a game</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Game Form */}
                            <div className="space-y-2">
                                <PreviewMedia
                                    initialMedia={
                                        data.logo_game
                                            ? { url: URL.createObjectURL(data.logo_game), file: data.logo_game }
                                            : null
                                    }
                                    onChange={(newFile) => setData("logo_game", newFile)}

                                    error={
                                        Object.keys(errors)
                                            .filter((key) => key.startsWith('logo_game'))
                                            .map((key) => (errors as Record<string, string>)[key])
                                            .join(', ')
                                    }
                                />

                                <Input
                                    type="text"
                                    placeholder="Game Title"
                                    value={data.nama_game}
                                    onChange={(e) => setData('nama_game', e.target.value)}
                                />
                                {errors.nama_game && <p className="text-sm text-red-500">{errors.nama_game}</p>}

                                <Input
                                    type="text"
                                    placeholder="Game Company"
                                    value={data.perusahaan_game}
                                    onChange={(e) => setData("perusahaan_game", e.target.value)}
                                />
                                {errors.perusahaan_game && <p className="text-sm text-red-500">{errors.perusahaan_game}</p>}

                                <Button type="button" onClick={addTopupData}>+ Top Up Data</Button>

                                <div className="space-y-2 mt-3">
                                    {data.topupData.map((item) => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Top Up Name"
                                                value={item.name}
                                                onChange={(e) => updateTopupData(item.id, e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="icon"
                                                onClick={() => deleteTopupData(item.id)}
                                            >
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <br />
                                <Label>How To</Label>
                                <RichTextEditor defaultHtmlValue={data.howTo} onChangeResult={(html) => setData('howTo', html)} />
                                {errors.howTo && <p className="text-sm text-red-500">{errors.howTo}</p>}
                            </div>
                            <div>
                                <Label className="grid w-full max-w-xs items-center gap-3 my-3">
                                    Voucher
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
                                                    Delete Voucher
                                                </Button>
                                            )}
                                        </div>

                                        {/* Inputs inside voucher */}
                                        {voucher.inputs.map((input, iIndex) => (
                                            <div key={input.id} className="flex gap-2 items-center">
                                                <Input
                                                    placeholder="Package name"
                                                    value={input.packageName}
                                                    onChange={e =>
                                                        updateInput(voucher.id, input.id, "packageName", e.target.value)
                                                    }
                                                />
                                                <Input
                                                    placeholder="Amount"
                                                    type="number"
                                                    min={0}
                                                    value={input.amount}
                                                    onChange={e =>
                                                        updateInput(voucher.id, input.id, "amount", String(e.target.value))
                                                    }
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

                                        {/* Add input inside voucher */}
                                        <Button type="button" size="sm" onClick={() => addInput(voucher.id)}>
                                            Tambah
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={addVoucher}>+ Voucher</Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Save</Button>
                        </CardFooter>
                    </Card>
                </form>
            </AdminLayout >
        </>
    );
}