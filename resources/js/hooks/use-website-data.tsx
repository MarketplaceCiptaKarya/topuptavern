export default function useWebsiteData() {
    const navbarData = {
        logo: {
            url: route('home'),
            src: '/logo.png',
            alt: 'Top-up tavern logo',
            title: '',
        },
        menu: [
            {
                title: 'Home',
                url: route('home'),
                isActive: route().current('home'),
            },
            {
                title: 'Check Transaction',
                url: route('check-transaction'),
                isActive: route().current('check-transaction'),
            },
        ],
    };
    const carouselData = [
        {
            id: crypto.randomUUID(),
            image: 'https://fls-9fb5ddfb-a4c6-41d2-bb62-2c1e6ae3e50a.laravel.cloud/carousels/Carousel1.webp',
            alt: 'Carousel 1',
        },
        {
            id: crypto.randomUUID(),
            image: 'https://fls-9fb5ddfb-a4c6-41d2-bb62-2c1e6ae3e50a.laravel.cloud/carousels/Carousel2.webp',
            alt: 'Carousel 2',
        },
        {
            id: crypto.randomUUID(),
            image: 'https://fls-9fb5ddfb-a4c6-41d2-bb62-2c1e6ae3e50a.laravel.cloud/carousels/Carousel3.webp',
            alt: 'Carousel 3',
        },
    ];
    const footerData = {
        logo: {
            src: '/logo.png',
            alt: 'Top-up Tavern Logo',
            title: 'Top-up Tavern',
            url: route('home'),
        },
        tagline: '',
        menuItems: [
            {
                title: 'Menu',
                links: [
                    { text: 'Home', url: route('home') },
                    { text: 'Check Transaction', url: route('check-transaction') },
                ],
            },
            {
                title: 'Company',
                links: [
                    { text: 'Contact Us', url: route('contact-us') },
                    { text: 'Privacy Policy', url: route('privacy-policy') },
                    { text: 'Terms and Conditions', url: route('terms-and-conditions') },
                ],
            },
        ],
        copyright: `© ${new Date().getFullYear()} Top-up Tavern. All rights reserved.`,
        bottomLinks: [],
    };
    const voucherTitle = 'Vouchers';

    return {
        navbarData,
        carouselData,
        footerData,
        voucherTitle,
    } as const;
}
