import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { useMapPoints } from '@/hooks/useMapPoints';

// Placeholder info cards — replace with real infographic data once available
const NODO_INFO_CARDS = [
  {
    icon: '🗺️',
    title: '¿Qué es un Nodo?',
    body: 'Un nodo es un espacio de encuentro comunitario donde vecinas y vecinos se organizan para impulsar el cuidado colectivo.',
  },
  {
    icon: '🤝',
    title: '¿Qué se hace en un Nodo?',
    body: 'Se llevan a cabo actividades, talleres y espacios de escucha para fortalecer los vínculos comunitarios.',
  },
  {
    icon: '📍',
    title: '¿Cómo encontrarlo?',
    body: 'Los nodos están distribuidos a lo largo del territorio. Podés localizarlos en el mapa interactivo.',
  },
  {
    icon: '💛',
    title: '¿Por qué participar?',
    body: 'Participar en un nodo es una forma de construir comunidad, aprender y acompañar a quienes más lo necesitan.',
  },
];

const CENTRO_INFO_CARDS = [
  {
    icon: '👂',
    title: '¿Qué es un Centro de Escucha?',
    body: 'Un espacio seguro donde personas en situación de vulnerabilidad pueden ser escuchadas y acompañadas.',
  },
  {
    icon: '🫂',
    title: '¿Qué ofrecen?',
    body: 'Atención personalizada, orientación y acompañamiento en salud mental, social y comunitaria.',
  },
  {
    icon: '🔒',
    title: 'Confidencialidad',
    body: 'Todo lo que se comparte en los centros de escucha se trata con total respeto y confidencialidad.',
  },
  {
    icon: '📞',
    title: '¿Cómo acceder?',
    body: 'Podés acercarte directamente al centro, comunicarte por teléfono o consultar el mapa para encontrar el más cercano.',
  },
];

function InfoCard({ card, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-start">
        <CardContent className="p-6 space-y-3">
          <span className="text-4xl">{card.icon}</span>
          <h3 className="font-semibold text-base text-foreground leading-snug">{card.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PointListItem({ point, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
            <h3 className="font-semibold text-base text-foreground leading-snug">{point.name}</h3>
          </div>

          {point.description && (
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">{point.description}</p>
          )}

          <div className="flex flex-wrap gap-3 pl-6 pt-1">
            {point.phone && (
              <a
                href={`tel:${point.phone}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                {point.phone}
              </a>
            )}
            {point.email && (
              <a
                href={`mailto:${point.email}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                {point.email}
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function NodosCentrosSection({ pointType, id, title, description, accentClass }) {
  const { data: points = [], isLoading } = useMapPoints(pointType, { onlyActive: true });

  const infoCards = pointType === 'centro_escucha' ? CENTRO_INFO_CARDS : NODO_INFO_CARDS;

  return (
    <section id={id} className="section-padding">
      <div className="container space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-4"
        >
          {accentClass && (
            <span className={`inline-block w-12 h-1 rounded-full ${accentClass} opacity-80`} />
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
          )}
        </motion.div>

        {/* Infographic placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center gap-3 py-14 px-6 text-center"
        >
          <Info className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-muted-foreground/60 text-sm font-medium">Infografía próximamente</p>
          <p className="text-muted-foreground/40 text-xs max-w-xs">
            Acá irá una infografía que explica visualmente cómo funciona este espacio comunitario.
          </p>
        </motion.div>

        {/* Swipeable info cards */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">¿Sabías que...?</h3>
          <div className="relative px-12">
            <Carousel
              opts={{ align: 'start', loop: false }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {infoCards.map((card, i) => (
                  <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                    <InfoCard card={card} index={i} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        </div>

        {/* Real map points list */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            {pointType === 'centro_escucha' ? 'Centros activos' : 'Nodos activos'}
          </h3>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2 p-5 border rounded-xl">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : points.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              No hay {pointType === 'centro_escucha' ? 'centros' : 'nodos'} activos por el momento.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {points.map((point, index) => (
                <PointListItem key={point.id} point={point} index={index} />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
