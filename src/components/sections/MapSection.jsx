import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(
  () => import('@/components/map/InteractiveMap').then((mod) => mod.InteractiveMap),
  {
    ssr: false,
  },
);
export function MapSection() {
    return (<section id="mapa" className="section-padding pt-0 bg-muted/30">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mapa del Gran Argüello
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorá nuestra red territorial. Encontrá nodos, centros de escucha y comunidades 
            de prácticas cerca tuyo.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
          <InteractiveMap />
        </motion.div>
      </div>
    </section>);
}
