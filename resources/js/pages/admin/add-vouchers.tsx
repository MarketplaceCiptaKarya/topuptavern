import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';
import { Package, SharedData } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AddVoucher() {
    const props = usePage<SharedData & { package: Package }>().props;

    // useForm to handle submission
    const { post, setData, data, reset, errors } = useForm<{
        vouchers: string[];
        package_id: string | null;
    }>({
        vouchers: [],
        package_id: props.package?.id ?? null, // set package id here
    });

    // local state for current input value
    const [voucherInput, setVoucherInput] = useState('');

    // add voucher to array
    const addVoucher = () => {
        if (!voucherInput.trim()) return; // ignore empty
        setData('vouchers', [...data.vouchers, voucherInput.trim()]);
        setVoucherInput(''); // clear input
    };

    // remove voucher from array
    const removeVoucher = (index: number) => {
        const updated = data.vouchers.filter((_, i) => i !== index);
        setData('vouchers', updated);
    };

    // handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.vouchers.store'), {
            // adjust route name
            onSuccess: () => {
                reset();
                router.visit(route('admin.vouchers'));
            },
        });
    };

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Voucher</CardTitle>
                        <CardDescription>
                            {props.package?.category_voucher?.game?.name} - {props.package?.category_voucher?.name} - {props.package?.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex gap-2">
                            <Input type="text" placeholder="Code Voucher" value={voucherInput} onChange={(e) => setVoucherInput(e.target.value)} />
                            <Button type="button" onClick={addVoucher}>
                                <Plus /> Voucher
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {data.vouchers.length === 0 && <p className="text-sm text-gray-500">No vouchers added yet.</p>}
                            {data.vouchers.map((v, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center justify-between rounded border p-2">
                                        <span>{v}</span>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeVoucher(i)}
                                        >
                                            <Trash2 /> Delete
                                        </Button>
                                    </div>

                                    {(errors as Record<string, string>)[`vouchers.${i}`] && (
                                        <p className="text-sm text-red-600">
                                            {(errors as Record<string, string>)[`vouchers.${i}`]}
                                        </p>
                                    )}

                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">
                            <Save />
                            Save
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </AdminLayout>
    );
}
