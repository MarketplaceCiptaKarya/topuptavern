import StaticCard from "@/components/static-card";
import MainLayout from "@/layouts/layout";
import { Head } from "@inertiajs/react";

export default function StaticPage() {
    return (
        <>
            <Head title="Static"></Head>
            <MainLayout>
                <div className="container mx-auto my-10 space-y-2 px-4">
                    <StaticCard />
                </div>
            </MainLayout>
        </>
    )
}