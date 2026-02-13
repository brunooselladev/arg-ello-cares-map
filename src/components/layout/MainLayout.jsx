import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useThemeConfig } from '@/hooks/useSiteConfig';
import { hexToHslChannels } from '@/lib/color';
export function MainLayout({ children }) {
    const { data: themeConfig } = useThemeConfig();
    useEffect(() => {
        if (!themeConfig?.primaryColor)
            return;
        const hsl = hexToHslChannels(themeConfig.primaryColor);
        if (!hsl)
            return;
        document.documentElement.style.setProperty('--primary', hsl);
        document.documentElement.style.setProperty('--ring', hsl);
        document.documentElement.style.setProperty('--sidebar-primary', hsl);
    }, [themeConfig?.primaryColor]);
    return (<div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>);
}
