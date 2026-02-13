import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
export function NewsCard({ news, index = 0, compact = false }) {
    const publishedDate = news.date || news.createdAt;
    return (<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.08 }} className={compact ? 'w-[280px] shrink-0' : ''}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
        {news.image && (<div className={compact ? 'relative h-36 overflow-hidden' : 'relative aspect-video overflow-hidden'}>
            <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"/>
          </div>)}
        <CardContent className={compact ? 'p-4' : 'p-5'}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3 w-3"/>
            <time dateTime={publishedDate || undefined}>
              {publishedDate ? format(new Date(publishedDate), "d 'de' MMMM, yyyy", { locale: es }) : 'Sin fecha'}
            </time>
          </div>
          <h3 className={compact ? 'font-semibold text-base text-foreground mb-2 line-clamp-2' : 'font-semibold text-lg text-foreground mb-2 line-clamp-2'}>
            {news.title}
          </h3>
          {news.summary && (<p className={compact ? 'text-sm text-muted-foreground line-clamp-2' : 'text-sm text-muted-foreground line-clamp-3'}>
              {news.summary}
            </p>)}
        </CardContent>
      </Card>
    </motion.div>);
}
