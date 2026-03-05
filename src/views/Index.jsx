import { MainLayout } from '@/components/layout/MainLayout';
import { BannerCarousel } from '@/components/sections/BannerCarousel';
import { HeroSection } from '@/components/sections/HeroSection';
import { MapSection } from '@/components/sections/MapSection';
import { NodosCentrosSection } from '@/components/sections/NodosCentrosSection';
import { ComunidadSection } from '@/components/sections/ComunidadSection';
import { AppMappaSection } from '@/components/sections/AppMappaSection';
import { CampaignsSection } from '@/components/sections/CampaignsSection';
import { CollaborateSection } from '@/components/sections/CollaborateSection';
import { ContactSection } from '@/components/sections/ContactSection';
const Index = () => {
    return (<MainLayout>
      <BannerCarousel autoplay/>
      <HeroSection />
      <MapSection />

      <NodosCentrosSection
        pointType="nodo"
        id="nodos"
        title="Nodos"
        description="Espacios de encuentro y organizacion comunitaria en el territorio."
        accentClass="bg-nodo"
      />

      <CampaignsSection />

      <NodosCentrosSection
        pointType="centro_escucha"
        id="centros"
        title="Centros de Escucha"
        description="Puntos de escucha y acompanamiento en el barrio."
        accentClass="bg-centro-escucha"
      />

      <ComunidadSection
        id="comunidad"
        title="Comunidad"
        description="Experiencias y aprendizajes compartidos por la red."
      />

      <AppMappaSection />
      <CollaborateSection />
      <ContactSection />
    </MainLayout>);
};
export default Index;
