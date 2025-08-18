import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/layouts/layout';
import { Head } from '@inertiajs/react';
import { FileSearch2 } from 'lucide-react';
import { useId } from 'react';

export default function CheckTransaction() {
    const id = useId();
    return (
        <>
            <Head title="Check Transaction"></Head>
            <MainLayout>
                <div className="container mx-auto my-4 flex items-center justify-center px-4">
                    <form className="w-full max-w-lg">
                        <Card className="rounded-2xl">
                            <CardHeader className="text-center">
                                <CardTitle>Easily and Quickly Check Your Invoice</CardTitle>
                                <CardDescription>View your purchase details using the Invoice number</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor={id}>Invoice Number</Label>
                                        <Input id={id} type="text" placeholder="ex. INV00001" required />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" variant="outline" className="w-full">
                                    <FileSearch2 />
                                    Search Invoice
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </MainLayout>
        </>
    );
}
