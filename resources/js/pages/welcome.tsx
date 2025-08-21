import GameCard3D from '@/components/game-card';
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel';
import useWebsiteData from '@/hooks/use-website-data';
import MainLayout from '@/layouts/layout';
import { Game } from '@/types';
import { Head } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';

interface WelcomeProps {
    games: Game[];
}

export default function Welcome({ games }: WelcomeProps) {
    const { carouselData, voucherTitle } = useWebsiteData();

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
                    <div className="text-xl font-bold">{voucherTitle}</div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
                        {games.map((game, i) => (
                            <GameCard3D key={i} image={game.logo} alt={game.name} title={game.name} link={route('detail-voucher', game.slug)} />
                        ))}
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
