import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { News } from '@/types/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NewsCardProps {
  news: News;
  index?: number;
}

export function NewsCard({ news, index = 0 }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
        {news.image_url && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
            {news.image_caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-xs text-white/90">{news.image_caption}</p>
              </div>
            )}
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3 w-3" />
            <time dateTime={news.published_at}>
              {format(new Date(news.published_at), "d 'de' MMMM, yyyy", { locale: es })}
            </time>
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
            {news.title}
          </h3>
          {news.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {news.excerpt}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
