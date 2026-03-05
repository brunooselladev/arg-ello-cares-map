import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Play, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { useNews } from '@/hooks/useNews';

// ─── YouTube helpers ────────────────────────────────────────────
function getYoutubeId(url) {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([-\w]{11})/
  );
  return m ? m[1] : null;
}

function isYoutubeUrl(url) {
  return !!url && /youtu(?:be\.com|\.be)/.test(url);
}

// ─── Video modal ────────────────────────────────────────────────
function VideoModal({ url, onClose }) {
  const ytId = getYoutubeId(url);
  const embedUrl = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1`
    : isYoutubeUrl(url)
    ? url.replace('watch?v=', 'embed/') + '?autoplay=1'
    : null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Video"
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <video src={url} controls autoPlay className="w-full h-full" />
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Single media card ──────────────────────────────────────────
function ComunidadCard({ item, onPlayVideo }) {
  const publishedDate = item.date || item.createdAt;
  const ytId = getYoutubeId(item.videoUrl);
  const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
  const hasVideo = !!item.videoUrl;
  const coverImage = ytThumb || item.image;

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer group">
      {/* Media area */}
      <div
        className="relative aspect-video overflow-hidden bg-muted shrink-0"
        onClick={hasVideo ? () => onPlayVideo(item.videoUrl) : undefined}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-xs">Sin imagen</span>
          </div>
        )}

        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="bg-white/90 hover:bg-white text-foreground rounded-full p-3 shadow-lg transition-colors">
              <Play className="h-6 w-6 fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Text */}
      <CardContent className="p-5 flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 shrink-0" />
          <time dateTime={publishedDate || undefined}>
            {publishedDate
              ? format(new Date(publishedDate), "d 'de' MMMM, yyyy", { locale: es })
              : 'Sin fecha'}
          </time>
        </div>

        <h3 className="font-semibold text-base text-foreground leading-snug line-clamp-2">
          {item.title}
        </h3>

        {item.summary && (
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{item.summary}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Section ────────────────────────────────────────────────────
export function ComunidadSection({ id, title = 'Comunidad', description }) {
  const { data: items = [], isLoading, isError } = useNews('comunidad', 12);
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section id={id} className="section-padding">
      <div className="container space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
          )}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground py-8">
            No se pudieron cargar las novedades de comunidad.
          </p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay novedades de comunidad por el momento.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative px-12"
          >
            <Carousel opts={{ align: 'start', loop: false }} className="w-full">
              <CarouselContent className="-ml-4">
                {items.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <ComunidadCard item={item} onPlayVideo={setActiveVideo} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </motion.div>
        )}
      </div>

      {/* Video modal */}
      {activeVideo && <VideoModal url={activeVideo} onClose={() => setActiveVideo(null)} />}
    </section>
  );
}
