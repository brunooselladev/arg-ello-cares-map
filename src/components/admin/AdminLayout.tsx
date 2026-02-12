import { ReactNode } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Newspaper,
  Megaphone,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  Menu,
  ImageIcon,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
  { title: 'Mapa', url: '/admin/map-points', icon: MapPin },
  { title: 'Novedades', url: '/admin/news', icon: Newspaper },
  { title: 'Campanas', url: '/admin/campaigns', icon: Megaphone },
  { title: 'Banners', url: '/admin/banners', icon: ImageIcon },
  { title: 'Tema', url: '/admin/theme', icon: Palette },
  { title: 'Voluntarios', url: '/admin/volunteers', icon: Users },
  { title: 'Mensajes', url: '/admin/messages', icon: MessageSquare },
  { title: 'Configuracion', url: '/admin/settings', icon: Settings },
];

function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <div className="p-4 border-b">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Red de Cuidados</p>
            </div>
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/" target="_blank" rel="noreferrer">
              <Home className="mr-2 h-4 w-4" />
              Ver sitio
            </a>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesion
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Acceso denegado</h1>
          <p className="text-muted-foreground mb-4">No tienes permisos de administrador.</p>
          <Button asChild>
            <a href="/">Volver al inicio</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center px-4 bg-background">
            <SidebarTrigger>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
          </header>
          <main className="flex-1 p-6 bg-muted/30 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
