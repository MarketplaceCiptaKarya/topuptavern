export default function useWebsiteData() {
    const navbarData = {
        logo: {
            url: route('home'),
            src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg',
            alt: 'Top-up tavern logo',
            title: 'Top-up Tavern',
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
            image: 'https://placehold.jp/0f0f0f/ffffff/1920x1080.png?text=placeholder1',
            alt: 'Placeholder Image 1',
        },
        {
            id: crypto.randomUUID(),
            image: 'https://placehold.jp/0f0f0f/ffffff/1920x1080.png?text=placeholder2',
            alt: 'Placeholder Image 1',
        },
        {
            id: crypto.randomUUID(),
            image: 'https://placehold.jp/0f0f0f/ffffff/1920x1080.png?text=placeholder3',
            alt: 'Placeholder Image 1',
        },
        {
            id: crypto.randomUUID(),
            image: 'https://placehold.jp/0f0f0f/ffffff/1920x1080.png?text=placeholder4',
            alt: 'Placeholder Image 1',
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
                    { text: 'Contact', url: '#' },
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
            { text: 'Terms and Conditions', url: '#' },
            { text: 'Privacy Policy', url: '#' },
        ],
    };

    return {
        navbarData,
        carouselData,
        footerData,
    } as const;
}
