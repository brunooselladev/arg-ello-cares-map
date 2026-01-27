import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, HandHeart, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSubmitVolunteer } from '@/hooks/useForms';
import { useToast } from '@/hooks/use-toast';

export function CollaborateSection() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
    availability: '',
  });
  const [submitted, setSubmitted] = useState(false);
  
  const submitVolunteer = useSubmitVolunteer();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitVolunteer.mutateAsync(formData);
      setSubmitted(true);
      setFormData({ full_name: '', email: '', phone: '', message: '', availability: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No pudimos enviar tu registro. Por favor, intentá de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section id="colaborar" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cómo Colaborar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tu apoyo hace posible que sigamos construyendo esta red de cuidados.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Donations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Donaciones</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Tu donación nos ayuda a mantener los espacios de contención, capacitar 
                  voluntarios y expandir la red a más barrios del territorio.
                </p>
                <p className="text-muted-foreground">
                  Cada aporte, por pequeño que sea, suma a la construcción de una 
                  comunidad más cuidada.
                </p>
                <div className="pt-4 space-y-3">
                  <Button className="w-full" asChild>
                    <a href="https://donaronline.org" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Donar con DonarOnline
                    </a>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Serás redirigido a la plataforma segura de DonarOnline
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Volunteering */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <HandHeart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Voluntariado</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      ¡Gracias por tu interés!
                    </h3>
                    <p className="text-muted-foreground">
                      Recibimos tu registro. Nos pondremos en contacto pronto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Dejanos tus datos y nos contactamos para contarte cómo podés sumarte.
                    </p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nombre completo *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        maxLength={255}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        maxLength={50}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Disponibilidad horaria</Label>
                      <Input
                        id="availability"
                        placeholder="Ej: Sábados por la mañana"
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        maxLength={200}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje (opcional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Contanos un poco sobre vos..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        maxLength={1000}
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={submitVolunteer.isPending}
                    >
                      {submitVolunteer.isPending ? 'Enviando...' : 'Quiero ser voluntario/a'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
