import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Skeleton } from '@/components/ui/skeleton';

export function CampaignsSection() {
  const { data: campaigns = [], isLoading } = useCampaigns(4);

  return (
    <section id="campanas-proyecto" className="section-padding bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Campañas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nuestras iniciativas para promover la salud mental y el bienestar comunitario.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {campaign.image_url ? (
                      <img
                        src={campaign.image_url}
                        alt={campaign.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                        <span className="text-4xl font-bold text-primary/30">
                          {campaign.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {campaign.video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="h-6 w-6 text-primary ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                      {campaign.title}
                    </h3>
                    {campaign.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {campaign.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No hay campañas activas en este momento.
          </p>
        )}
      </div>
    </section>
  );
}
