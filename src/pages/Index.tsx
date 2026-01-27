import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { MapSection } from '@/components/sections/MapSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { AppMappaSection } from '@/components/sections/AppMappaSection';
import { CampaignsSection } from '@/components/sections/CampaignsSection';
import { CollaborateSection } from '@/components/sections/CollaborateSection';
import { ContactSection } from '@/components/sections/ContactSection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <MapSection />
      
      <NewsSection 
        section="nodos"
        id="nodos"
        title="Nodos"
        description="Espacios de encuentro y organización comunitaria en el territorio."
      />
      
      <NewsSection 
        section="centros_escucha"
        id="centros-escucha"
        title="Centros de Escucha"
        description="Lugares seguros donde encontrar acompañamiento y contención."
      />
      
      <NewsSection 
        section="comunidad_practicas"
        id="comunidad-practicas"
        title="Comunidad de Prácticas"
        description="Red de profesionales y voluntarios que comparten saberes y experiencias."
      />
      
      <AppMappaSection />
      <CampaignsSection />
      <CollaborateSection />
      <ContactSection />
    </MainLayout>
  );
};

export default Index;
