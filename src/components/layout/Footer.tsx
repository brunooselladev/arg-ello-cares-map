import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Red de Cuidados</p>
                <p className="text-sm opacity-70">Gran Argüello</p>
              </div>
            </div>
            <p className="text-sm opacity-70">
              Construyendo comunidad y cuidando la salud mental en nuestro territorio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="/#mapa" className="hover:opacity-100 transition-opacity">Mapa</a></li>
              <li><a href="/#nodos" className="hover:opacity-100 transition-opacity">Nodos</a></li>
              <li><a href="/#app-mappa" className="hover:opacity-100 transition-opacity">App MAPPA</a></li>
              <li><a href="/#colaborar" className="hover:opacity-100 transition-opacity">Colaborar</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Contacto</h3>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contacto@redgranargüello.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+54 351 XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Gran Argüello, Córdoba</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="mb-4 font-semibold">¿Necesitás ayuda?</h3>
            <p className="text-sm opacity-70 mb-4">
              No estás solo/a. Nuestra red está aquí para acompañarte.
            </p>
            <a
              href="/#app-mappa"
              className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Conocé la App MAPPA
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-60">
          <p>© {new Date().getFullYear()} Red de Cuidados del Gran Argüello. Todos los derechos reservados.</p>
          <Link to="/admin" className="hover:opacity-100 transition-opacity">
            Acceso Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
