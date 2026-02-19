import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BannerCarousel } from '@/components/sections/BannerCarousel';
import { HeroSection } from '@/components/sections/HeroSection';
import {
  SectionSuspense,
  NewsSectionSkeleton,
  MapSectionSkeleton,
} from '@/components/sections/Suspense';

// Lazy load sections that are below the fold
const MapSection = dynamic(
  () => import('@/components/sections/MapSection').then((mod) => ({ default: mod.MapSection })),
  { loading: () => <MapSectionSkeleton />, ssr: true }
);

const NewsSection = dynamic(
  () => import('@/components/sections/NewsSection').then((mod) => ({ default: mod.NewsSection })),
  { loading: () => <NewsSectionSkeleton />, ssr: true }
);

const AppMappaSection = dynamic(
  () => import('@/components/sections/AppMappaSection').then((mod) => ({ default: mod.AppMappaSection })),
  { loading: () => <NewsSectionSkeleton />, ssr: true }
);

const CampaignsSection = dynamic(
  () => import('@/components/sections/CampaignsSection').then((mod) => ({ default: mod.CampaignsSection })),
  { loading: () => <NewsSectionSkeleton />, ssr: true }
);

const CollaborateSection = dynamic(
  () => import('@/components/sections/CollaborateSection').then((mod) => ({ default: mod.CollaborateSection })),
  { loading: () => <NewsSectionSkeleton />, ssr: true }
);

const ContactSection = dynamic(
  () => import('@/components/sections/ContactSection').then((mod) => ({ default: mod.ContactSection })),
  { loading: () => <NewsSectionSkeleton />, ssr: true }
);

export default function OptimizedIndex() {
  return (
    <MainLayout>
      {/* Above the fold - loaded immediately */}
      <BannerCarousel autoplay />
      <HeroSection />

      {/* Below the fold - lazy loaded with Suspense */}
      <SectionSuspense fallback={<MapSectionSkeleton />}>
        <MapSection />
      </SectionSuspense>

      <SectionSuspense fallback={<NewsSectionSkeleton />}>
        <NewsSection
          category="nodos"
          id="nodos"
          title="Nodos"
          description="Espacios de encuentro y organizacion comunitaria en el territorio."
        />
      </SectionSuspense>

      <SectionSuspense fallback={<NewsSectionSkeleton />}>
        <NewsSection
          category="campanas"
          id="campanas"
          title="Campanas"
          description="Acciones comunitarias para promover el cuidado colectivo."
        />
      </SectionSuspense>

      <SectionSuspense fallback={<NewsSectionSkeleton />}>
        <NewsSection
          category="centros"
          id="centros"
          title="Centros"
          description="Puntos de escucha y acompanamiento en el barrio."
        />
      </SectionSuspense>

      <SectionSuspense fallback={<NewsSectionSkeleton />}>
        <NewsSection
          category="comunidad"
          id="comunidad"
          title="Comunidad"
          description="Experiencias y aprendizajes compartidos por la red."
        />
      </SectionSuspense>

      <SectionSuspense fallback={<NewsSectionSkeleton />}>
        <AppMappaSection />
      </SectionSuspense>

      <SectionSuspense fallback={<NewsSectionSkeleton />}>
        <CampaignsSection />
      </SectionSuspense>

      <SectionSuspense fallback={<NewsSectionSkeleton />}>
        <CollaborateSection />
      </SectionSuspense>

      <SectionSuspense fallback={<NewsSectionSkeleton />}>
        <ContactSection />
      </SectionSuspense>
    </MainLayout>
  );
}
