import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Mapa', href: '/#mapa' },
  { name: 'Nodos', href: '/#nodos' },
  { name: 'Campanas', href: '/#campanas' },
  { name: 'Centros', href: '/#centros' },
  { name: 'Comunidad', href: '/#comunidad' },
  { name: 'App MAPPA', href: '/#app-mappa' },
  { name: 'Colaborar', href: '/#colaborar' },
  { name: 'Contacto', href: '/#contacto' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">Red de Cuidados</p>
            <p className="text-xs text-muted-foreground">Gran Arguello</p>
          </div>
        </Link>

        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container py-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
