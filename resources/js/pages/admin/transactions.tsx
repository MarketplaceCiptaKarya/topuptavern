import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';

export default function AdminTransactions() {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>View Transactions</CardTitle>
                    <CardDescription>List of transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <h1>BUSSSSSS</h1>
                </CardContent>
            </Card>
        </>
    );
}

AdminTransactions.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
