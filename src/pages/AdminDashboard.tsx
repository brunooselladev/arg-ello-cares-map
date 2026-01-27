import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Newspaper, Megaphone, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { useMapPoints } from '@/hooks/useMapPoints';
import { useNews } from '@/hooks/useNews';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useVolunteers, useContactMessages } from '@/hooks/useForms';
import { useAppUserCount } from '@/hooks/useSiteConfig';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: mapPoints = [] } = useMapPoints();
  const { data: news = [] } = useNews();
  const { data: campaigns = [] } = useCampaigns();
  const { data: volunteers = [] } = useVolunteers();
  const { data: messages = [] } = useContactMessages();
  const { count: appUserCount } = useAppUserCount();

  const unreadMessages = messages.filter(m => !m.is_read).length;

  const stats = [
    {
      title: 'Puntos en el Mapa',
      value: mapPoints.length,
      icon: MapPin,
      href: '/admin/map-points',
      color: 'text-nodo',
    },
    {
      title: 'Novedades',
      value: news.length,
      icon: Newspaper,
      href: '/admin/news',
      color: 'text-centro-escucha',
    },
    {
      title: 'Campañas',
      value: campaigns.length,
      icon: Megaphone,
      href: '/admin/campaigns',
      color: 'text-comunidad-practicas',
    },
    {
      title: 'Voluntarios',
      value: volunteers.length,
      icon: Users,
      href: '/admin/volunteers',
      color: 'text-primary',
    },
    {
      title: 'Mensajes',
      value: messages.length,
      subtitle: unreadMessages > 0 ? `${unreadMessages} sin leer` : undefined,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'text-orange-500',
    },
    {
      title: 'Usuarios App',
      value: appUserCount,
      icon: TrendingUp,
      href: '/admin/settings',
      color: 'text-green-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Panel de administración de la Red de Cuidados del Gran Argüello
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-xs text-orange-500 mt-1">{stat.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link 
                to="/admin/map-points" 
                className="block p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-nodo" />
                  <span className="font-medium">Agregar punto al mapa</span>
                </div>
              </Link>
              <Link 
                to="/admin/news" 
                className="block p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="h-5 w-5 text-centro-escucha" />
                  <span className="font-medium">Crear novedad</span>
                </div>
              </Link>
              <Link 
                to="/admin/campaigns" 
                className="block p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Megaphone className="h-5 w-5 text-comunidad-practicas" />
                  <span className="font-medium">Nueva campaña</span>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Últimos Voluntarios</CardTitle>
            </CardHeader>
            <CardContent>
              {volunteers.slice(0, 5).length > 0 ? (
                <ul className="space-y-2">
                  {volunteers.slice(0, 5).map((vol) => (
                    <li key={vol.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{vol.full_name}</span>
                      <span className="text-muted-foreground">{vol.email}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay voluntarios registrados aún.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
