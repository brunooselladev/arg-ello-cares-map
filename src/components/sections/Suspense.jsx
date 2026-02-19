'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function BannerSkeleton() {
  return <Skeleton className="h-[220px] md:h-[320px] w-full rounded-xl" />;
}

export function NewsSectionSkeleton() {
  return (
    <section className="container py-12">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    </section>
  );
}

export function MapSectionSkeleton() {
  return (
    <section className="container py-12">
      <Skeleton className="h-96 w-full rounded-lg" />
    </section>
  );
}

export function SectionSuspense({ children, fallback }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
