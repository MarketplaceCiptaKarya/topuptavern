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
import { dateFormatter } from '@/lib/global';
import { Game, PaginatedResponse, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function ShowGames() {
    const { games, search } = usePage<SharedData & { games: PaginatedResponse<Game>; search: string }>().props;
    const [input, setInput] = useState<string>(search);
    const initialLoad = useRef<boolean>(true);
    const debouncedValue = useDebouncedValue(input, 500);

    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false;
            return;
        }

        router.get(
            route('admin.games'),
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
                    <CardTitle>View Games</CardTitle>
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Companny</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Updated At</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {games.data.map((game) => (
                                    <TableRow key={game.id}>
                                        <TableCell>{game.name}</TableCell>
                                        <TableCell>{game.company}</TableCell>
                                        <TableCell>{dateFormatter.format(new Date(game.created_at))}</TableCell>
                                        <TableCell>{dateFormatter.format(new Date(game.updated_at))}</TableCell>
                                        <TableCell>
                                            <span className="flex flex-row gap-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={route('admin.games.edit', game.id)}>
                                                        <Pencil />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        router.delete(route('admin.games.destroy', game.id), {
                                                            onSuccess: () => {
                                                                toast.success('Game deleted successfully');
                                                            },
                                                        });
                                                    }}
                                                >
                                                    <Trash2 />
                                                    Delete
                                                </Button>
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div>
                            <Pagination>
                                <PaginationContent>
                                    {games.current_page > 1 && (
                                        <>
                                            <PaginationItem>
                                                <PaginationPrevious href={games.prev_page_url || ''} />
                                            </PaginationItem>
                                        </>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink href={'#'} isActive>
                                            {games.current_page}
                                        </PaginationLink>
                                    </PaginationItem>
                                    {games.current_page < games.last_page && (
                                        <>
                                            <PaginationItem>
                                                <PaginationLink href={games.next_page_url || ''}>{games.current_page + 1}</PaginationLink>
                                            </PaginationItem>

                                            {games.current_page < games.last_page - 1 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}

                                            <PaginationItem>
                                                <PaginationLink href={games.last_page_url || ''}>{games.last_page}</PaginationLink>
                                            </PaginationItem>

                                            <PaginationItem>
                                                <PaginationNext href={games.next_page_url || ''} />
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

ShowGames.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
