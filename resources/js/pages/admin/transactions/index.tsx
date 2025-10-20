import { Head, Link } from '@inertiajs/react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { currencyFormatter } from '@/lib/global'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AdminLayout from '@/layouts/admin-layout'
import TransactionStatusBadge from '@/components/transaction-status-badge'

export default function Index({ transactions }: { transactions: { data: any[]; current_page: number; last_page: number } }) {
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'external_id',
            header: 'Invoice',
            cell: ({ row }) => <span className="font-medium">{row.original.external_id}</span>,
        },
        {
            accessorKey: 'customer_name',
            header: 'Customer',
        },
        {
            accessorKey: 'total_amount',
            header: 'Total',
            cell: ({ row }) => <span>{currencyFormatter.format(row.original.total_amount)}</span>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status
                const variant =
                    status === 'PAID'
                        ? 'success'
                        : status === 'FAILED'
                            ? 'failed'
                            : status === 'EXPIRED'
                                ? 'failed'
                                : 'pending'

                return <TransactionStatusBadge status={variant} />
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <Link href={route('admin.transactions.show', row.original.id)}>
                    <Button size="sm" variant="outline">
                        View
                    </Button>
                </Link>
            ),
        },
    ]

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>View Transactions</CardTitle>
                    <CardDescription>List of transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={transactions.data}
                        searchPlaceholder="Search invoice or customer..."
                        searchableColumns={['external_id', 'customer_name']}
                        pagination={{
                            currentPage: transactions.current_page,
                            totalPages: transactions.last_page,
                            onPageChange: (page) =>
                                window.location.href = route('admin.transactions.index', { page }),
                        }}
                    />
                </CardContent>
            </Card>
        </>
    )
}

Index.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;