import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInfiniteNews } from '@/hooks/useNews';
import { NewsCard } from '@/components/ui/NewsCard';
import { NEWS_CATEGORY_LABELS } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
export function NewsSection({ category, id, title, description }) {
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, } = useInfiniteNews(category, 6);
    const sentinelRef = useRef(null);
    const allItems = useMemo(() => {
        return (data?.pages || []).flatMap((page) => page.items);
    }, [data]);
    useEffect(() => {
        const element = sentinelRef.current;
        if (!element || !hasNextPage)
            return;
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first?.isIntersecting && !isFetchingNextPage) {
                void fetchNextPage();
            }
        }, { rootMargin: '120px' });
        observer.observe(element);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, allItems.length]);
    const sectionTitle = title || NEWS_CATEGORY_LABELS[category];
    return (<section id={id} className="section-padding">
      <div className="container space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{sectionTitle}</h2>
          {description && <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>}
        </motion.div>

        {isLoading ? (<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (<div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full"/>
                <Skeleton className="h-6 w-1/2"/>
                <Skeleton className="h-4 w-full"/>
              </div>))}
          </div>) : isError ? (<p className="text-center text-muted-foreground">No se pudieron cargar las novedades.</p>) : allItems.length === 0 ? (<p className="text-center text-muted-foreground">No hay novedades visibles para esta categoria.</p>) : (<>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allItems.map((item, index) => (
                <NewsCard key={item.id} news={item} index={index} />
              ))}
            </div>
            {hasNextPage && <div ref={sentinelRef} className="w-full h-4" aria-hidden/>}
            {isFetchingNextPage && (<p className="text-center text-sm text-muted-foreground">Cargando mas novedades...</p>)}
          </>)}
      </div>
    </section>);
}
