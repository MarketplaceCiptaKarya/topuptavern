import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import useWebsiteData from '@/hooks/use-website-data';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { navbarData, footerData } = useWebsiteData();

    return (
        <>
            <div className="container mx-auto px-4">
                <Navbar logo={navbarData.logo} menu={navbarData.menu} />
            </div>
            <main>{children}</main>
            <div>
                <Footer
                    logo={footerData.logo}
                    bottomLinks={footerData.bottomLinks}
                    copyright={footerData.copyright}
                    tagline={footerData.tagline}
                    menuItems={footerData.menuItems}
                />
            </div>
        </>
    );
}
