import GameCard3D from '@/components/game-card';
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel';
import useWebsiteData from '@/hooks/use-website-data';
import MainLayout from '@/layouts/layout';
import { Head } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';

interface WelcomeProps {
    vouchers: {
        id: number;
        title: string;
        image: string;
        alt: string;
        link: string;
    }[];
}

export default function Welcome() {
    const { carouselData } = useWebsiteData();

    return (
        <>
            <Head title="Home"></Head>
            <MainLayout>
                <div className="flex w-full items-center justify-center">
                    <Carousel
                        className="w-full"
                        opts={{
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 5000,
                            }),
                        ]}
                    >
                        <CarouselContent>
                            {carouselData.map((carousel, index) => (
                                <CarouselItem key={carousel.id + index}>
                                    <div className="h-96 max-h-96 w-full">
                                        <img src={carousel.image} alt={carousel.alt} className="h-full w-full object-contain" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <span className="absolute bottom-0 left-1/2">
                            <CarouselDots />
                        </span>
                    </Carousel>
                </div>
                <div className="container mx-auto my-10 space-y-2 px-4">
                    <div className="text-xl font-bold">Title</div>
                    <div className="grid grid-cols-5 gap-4">
                        {Array.from({ length: 100 }).map((_, i) => (
                            <GameCard3D
                                image={
                                    i % 2 === 0
                                        ? 'https://assets.mabartopup.id/category/ludo-world-Uj7H-kVS0.webp'
                                        : 'https://assets.mabartopup.id/category/steam-wallet-code-V3Gn-rVN8.jpg'
                                }
                                // image={'https://assets.mabartopup.id/category/steam-wallet-code-V3Gn-rVN8.jpg'}
                                alt={''}
                                title={'steam'}
                                link={route('home')}
                                key={i}
                            />
                        ))}
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
