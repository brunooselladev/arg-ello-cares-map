import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from '@/components/ui/carousel';
import { useBanners } from '@/hooks/useBanners';
import { Skeleton } from '@/components/ui/skeleton';
export function BannerCarousel({ autoplay = true, intervalMs = 4500 }) {
    const { data: banners = [], isLoading, isError } = useBanners();
    const [api, setApi] = useState();
    useEffect(() => {
        if (!autoplay || !api || banners.length <= 1)
            return;
        const interval = window.setInterval(() => {
            api.scrollNext();
        }, intervalMs);
        return () => window.clearInterval(interval);
    }, [api, autoplay, banners.length, intervalMs]);
    if (isLoading) {
        return (<section className="container pt-6 md:pt-8">
        <Skeleton className="h-[220px] md:h-[320px] w-full rounded-xl"/>
      </section>);
    }
    if (isError || banners.length === 0)
        return null;
    return (<section className="container pt-6 md:pt-8">
      <Carousel setApi={setApi} opts={{
            align: 'start',
            loop: banners.length > 1,
        }} className="w-full">
        <CarouselContent>
          {banners.map((banner) => (<CarouselItem key={banner.id}>
              <div className="relative h-[220px] md:h-[320px] overflow-hidden rounded-xl border bg-muted">
                <img src={banner.imageUrl} alt="Banner" className="h-full w-full object-cover" loading="lazy"/>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"/>
              </div>
            </CarouselItem>))}
        </CarouselContent>

        {banners.length > 1 && (<>
            <CarouselPrevious className="left-4"/>
            <CarouselNext className="right-4"/>
          </>)}
      </Carousel>
    </section>);
}
