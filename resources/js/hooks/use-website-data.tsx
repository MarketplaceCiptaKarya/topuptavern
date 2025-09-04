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
            src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg',
            alt: 'Top-up Tavern Logo',
            title: 'Top-up Tavern',
            url: route('home'),
        },
        tagline: '',
        menuItems: [
            {
                title: 'Product',
                links: [
                    { text: 'Overview', url: '#' },
                    { text: 'Pricing', url: '#' },
                    { text: 'Marketplace', url: '#' },
                    { text: 'Features', url: '#' },
                    { text: 'Integrations', url: '#' },
                    { text: 'Pricing', url: '#' },
                ],
            },
            {
                title: 'Company',
                links: [
                    { text: 'About', url: '#' },
                    { text: 'Team', url: '#' },
                    { text: 'Blog', url: '#' },
                    { text: 'Careers', url: '#' },
                    { text: 'Contact', url: route('contact-us'), },
                    { text: 'Privacy', url: '#' },
                ],
            },
            {
                title: 'Resources',
                links: [
                    { text: 'Help', url: '#' },
                    { text: 'Sales', url: '#' },
                    { text: 'Advertise', url: '#' },
                ],
            },
            {
                title: 'Social',
                links: [
                    { text: 'Twitter', url: '#' },
                    { text: 'Instagram', url: '#' },
                    { text: 'LinkedIn', url: '#' },
                ],
            },
        ],
        copyright: `© ${new Date().getFullYear()} Top-up Tavern. All rights reserved.`,
        bottomLinks: [
            { text: 'Terms and Conditions', url: route('terms-and-conditions'), },
            { text: 'Privacy Policy', url: route('privacy-policy'), },
        ],
    };
    const voucherTitle = 'Vouchers';

    return {
        navbarData,
        carouselData,
        footerData,
        voucherTitle,
    } as const;
}
