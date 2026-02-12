import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInfiniteNews } from '@/hooks/useNews';
import { NewsCard } from '@/components/ui/NewsCard';
import type { NewsCategory } from '@/types/database';
import { NEWS_CATEGORY_LABELS } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsSectionProps {
  category: NewsCategory;
  id: string;
  title?: string;
  description?: string;
}

export function NewsSection({ category, id, title, description }: NewsSectionProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNews(category, 6);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const allItems = useMemo(() => {
    return (data?.pages || []).flatMap((page) => page.items);
  }, [data]);

  const latestItem = allItems[0] ?? null;
  const historyItems = allItems.slice(1);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '120px' },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, historyItems.length]);

  const sectionTitle = title || NEWS_CATEGORY_LABELS[category];

  return (
    <section id={id} className="section-padding">
      <div className="container space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{sectionTitle}</h2>
          {description && <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>}
        </motion.div>

        {isLoading ? (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-44 w-[280px] shrink-0" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground">No se pudieron cargar las novedades.</p>
        ) : !latestItem ? (
          <p className="text-center text-muted-foreground">No hay novedades visibles para esta categoria.</p>
        ) : (
          <>
            <div className="max-w-4xl">
              <h3 className="text-lg font-semibold text-foreground mb-3">Ultima novedad</h3>
              <NewsCard news={latestItem} />
            </div>

            <div>
              <h4 className="text-base font-semibold text-foreground mb-3">Historial</h4>
              {historyItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay historial adicional por ahora.</p>
              ) : (
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-4 min-w-max">
                    {historyItems.map((item, index) => (
                      <NewsCard key={item.id} news={item} index={index} compact />
                    ))}
                    {hasNextPage && <div ref={sentinelRef} className="w-4 shrink-0" aria-hidden />}
                  </div>
                </div>
              )}

              {isFetchingNextPage && (
                <p className="mt-2 text-sm text-muted-foreground">Cargando mas novedades...</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
