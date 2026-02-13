import { MainLayout } from '@/components/layout/MainLayout';
import { BannerCarousel } from '@/components/sections/BannerCarousel';
import { HeroSection } from '@/components/sections/HeroSection';
import { MapSection } from '@/components/sections/MapSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { AppMappaSection } from '@/components/sections/AppMappaSection';
import { CampaignsSection } from '@/components/sections/CampaignsSection';
import { CollaborateSection } from '@/components/sections/CollaborateSection';
import { ContactSection } from '@/components/sections/ContactSection';
const Index = () => {
    return (<MainLayout>
      <BannerCarousel autoplay/>
      <HeroSection />
      <MapSection />

      <NewsSection category="nodos" id="nodos" title="Nodos" description="Espacios de encuentro y organizacion comunitaria en el territorio."/>

      <NewsSection category="campanas" id="campanas" title="Campanas" description="Acciones comunitarias para promover el cuidado colectivo."/>

      <NewsSection category="centros" id="centros" title="Centros" description="Puntos de escucha y acompanamiento en el barrio."/>

      <NewsSection category="comunidad" id="comunidad" title="Comunidad" description="Experiencias y aprendizajes compartidos por la red."/>

      <AppMappaSection />
      <CampaignsSection />
      <CollaborateSection />
      <ContactSection />
    </MainLayout>);
};
export default Index;
