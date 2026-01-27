import { motion } from 'framer-motion';
import { Smartphone, HeartHandshake, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNews } from '@/hooks/useNews';
import { NewsCard } from '@/components/ui/NewsCard';

export function AppMappaSection() {
  const { data: news = [] } = useNews('app_mappa', 2);

  const features = [
    {
      icon: Smartphone,
      title: 'Proceso de Armado',
      description: 'Una app construida con y para la comunidad, diseñada desde las necesidades reales del territorio.',
    },
    {
      icon: Users,
      title: 'Reglas de Convivencia',
      description: 'Espacios seguros y respetuosos. Protocolos claros para el acompañamiento entre pares.',
    },
    {
      icon: Sparkles,
      title: 'Futuro del Proyecto',
      description: 'Expandiendo la red, sumando funcionalidades y llegando a más personas que necesitan apoyo.',
    },
  ];

  return (
    <section id="app-mappa" className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            App MAPPA
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Una herramienta digital para conectar personas que necesitan ayuda con quienes pueden ofrecerla.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12"
        >
          <Card className="p-6 bg-primary text-primary-foreground text-center hover:bg-primary/90 transition-colors cursor-pointer">
            <HeartHandshake className="h-10 w-10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Necesito Ayuda</h3>
            <p className="text-sm opacity-90 mb-4">No estás solo/a. Conectate con nuestra red de contención.</p>
            <Button variant="secondary" className="w-full">
              Buscar Apoyo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          <Card className="p-6 bg-card border-2 border-primary text-center hover:bg-accent transition-colors cursor-pointer">
            <Users className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Ofrezco Ayuda</h3>
            <p className="text-sm text-muted-foreground mb-4">Sumate a la red y acompañá a quienes más lo necesitan.</p>
            <Button className="w-full">
              Ser Voluntario <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </motion.div>

        {/* Related News */}
        {news.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-foreground text-center mb-6">
              Novedades de la App
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {news.map((item, index) => (
                <NewsCard key={item.id} news={item} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
