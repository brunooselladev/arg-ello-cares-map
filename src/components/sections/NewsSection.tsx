import { motion } from 'framer-motion';
import { useNews } from '@/hooks/useNews';
import { NewsCard } from '@/components/ui/NewsCard';
import type { NewsSection as NewsSectionType } from '@/types/database';
import { NEWS_SECTION_LABELS } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsSectionProps {
  section: NewsSectionType;
  id: string;
  title?: string;
  description?: string;
  limit?: number;
}

export function NewsSection({ section, id, title, description, limit = 2 }: NewsSectionProps) {
  const { data: news = [], isLoading } = useNews(section, limit);

  const sectionTitle = title || NEWS_SECTION_LABELS[section];

  return (
    <section id={id} className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {sectionTitle}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {news.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No hay novedades disponibles en esta sección.
          </p>
        )}
      </div>
    </section>
  );
}
