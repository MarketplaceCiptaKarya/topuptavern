import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/layouts/layout";
import { SharedData } from "@/types";
import { Head, usePage } from "@inertiajs/react";

const css = `
.information h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.information h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.information h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.information p {
    margin-bottom: 1rem;
}

.information ul {
    list-style-type: none;
    margin-bottom: 1rem;
}

.information ul.list {
    list-style-type: disc;
    list-style-position: inside;
    margin-bottom: 1rem;
}

.information li {
    margin-bottom: 0.5rem;
}

.information strong {
    font-weight: bold;
}

.information a {
    color: #1d4ed8;
    text-decoration: underline;
}
`;

export default function StaticPage() {
    const {
        title: pageTitle,
        content: pageContent,
    } = usePage<
        SharedData & {
            title: string;
            content: string;
        }
    >().props;

    return (
        <>
            <Head title={pageTitle}>
                <style>{css}</style>
            </Head>
            <MainLayout>
                <div className="container mx-auto my-10 space-y-2 px-4">
                    <Card className="w-full">
                        <CardContent>
                            <section className="information container mx-auto p-4 px-16" dangerouslySetInnerHTML={{ __html: pageContent }}></section>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        </>
    )
}