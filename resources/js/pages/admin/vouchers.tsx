import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/use-debounced';
import AdminLayout from '@/layouts/admin-layout';
import { Package, PaginatedResponse, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ShowVouchers() {
    const { packages, search } = usePage<SharedData & { packages: PaginatedResponse<Package>; search: string }>().props;
    const [input, setInput] = useState<string>(search);
    const initialLoad = useRef<boolean>(true);
    const debouncedValue = useDebouncedValue(input, 500);
    console.log('packages', packages.data);
    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false;
            return;
        }

        router.get(
            route('admin.vouchers'),
            { search: debouncedValue },
            {
                preserveState: true,
            },
        );
    }, [debouncedValue]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>View Vouchers</CardTitle>
                    <CardDescription>List of games</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="{`w-full whitespace-nowrap`} space-y-5 overflow-x-auto">
                        <div className="flex p-4">
                            <Input type="text" placeholder="Search by name" value={input} onChange={(e) => setInput(e.target.value)} />
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Game Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Package Name</TableHead>
                                    {/* <TableHead>Code</TableHead> */}
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.data.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.category_voucher?.game?.name ?? '-'}</TableCell>
                                        <TableCell>{p.category_voucher?.name ?? '-'}</TableCell>
                                        <TableCell>{p.name ?? '-'}</TableCell>
                                        {/* <TableCell>{voucher.voucher_code}</TableCell> */}
                                        <TableCell>
                                            <span className="flex flex-row gap-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={route('admin.vouchers.edit', p.id)}>
                                                        <Pencil /> Edit
                                                    </Link>
                                                </Button>
                                                {/* <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        router.delete(route('admin.games.destroy', voucher.id), {
                                                            onSuccess: () => {
                                                                toast.success('Game deleted successfully');
                                                            },
                                                        });
                                                    }}
                                                >
                                                    Delete
                                                </Button> */}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div>
                            <Pagination>
                                <PaginationContent>
                                    {packages.current_page > 1 && (
                                        <>
                                            <PaginationItem>
                                                <PaginationPrevious href={packages.prev_page_url || ''} />
                                            </PaginationItem>
                                        </>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink href={'#'} isActive>
                                            {packages.current_page}
                                        </PaginationLink>
                                    </PaginationItem>
                                    {packages.current_page < packages.last_page && (
                                        <>
                                            <PaginationItem>
                                                <PaginationLink href={packages.next_page_url || ''}>{packages.current_page + 1}</PaginationLink>
                                            </PaginationItem>

                                            {packages.current_page < packages.last_page - 1 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}

                                            <PaginationItem>
                                                <PaginationLink href={packages.last_page_url || ''}>{packages.last_page}</PaginationLink>
                                            </PaginationItem>

                                            <PaginationItem>
                                                <PaginationNext href={packages.next_page_url || ''} />
                                            </PaginationItem>
                                        </>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

ShowVouchers.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
