import { motion } from 'framer-motion';
import { Heart, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function HeroSection() {
    return (<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10"/>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"/>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"/>

      <div className="container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Heart className="h-4 w-4"/>
              <span className="text-sm font-medium">Cuidando la salud mental comunitaria</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Red de Cuidados del <span className="text-primary">Gran Arguello</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Una red territorial de contencion, acompanamiento y promocion de la salud mental.
            Porque cuidarnos entre todos es la mejor forma de cuidar.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <a href="#mapa">
                <MapPin className="mr-2 h-5 w-5"/>
                Ver el mapa
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#app-mappa">Conoce la App MAPPA</a>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="p-4 rounded-lg bg-card border">
              <Users className="h-6 w-6 text-primary mx-auto mb-2"/>
              <p className="text-2xl font-bold text-foreground">1500+</p>
              <p className="text-sm text-muted-foreground">Usuarios de la App</p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <MapPin className="h-6 w-6 text-primary mx-auto mb-2"/>
              <p className="text-2xl font-bold text-foreground">15+</p>
              <p className="text-sm text-muted-foreground">Puntos en la red</p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <Heart className="h-6 w-6 text-primary mx-auto mb-2"/>
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">Acompanamiento</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);
}
