import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppUserCount, useUpdateSiteConfig } from '@/hooks/useSiteConfig';
import { useToast } from '@/hooks/use-toast';
import { Save, Users } from 'lucide-react';

export default function AdminSettings() {
  const { count, isLoading } = useAppUserCount();
  const [userCount, setUserCount] = useState<string>('');
  const updateConfig = useUpdateSiteConfig();
  const { toast } = useToast();

  // Initialize form when data loads
  useState(() => {
    if (!isLoading) {
      setUserCount(String(count));
    }
  });

  const handleSaveUserCount = async () => {
    try {
      await updateConfig.mutateAsync({
        key: 'app_user_count',
        value: userCount,
      });
      toast({ title: 'Contador actualizado correctamente' });
    } catch (error) {
      toast({ title: 'Error al guardar', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground">
            Ajustes generales del sitio.
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* User Count */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Contador de Usuarios</CardTitle>
                  <CardDescription>
                    Cantidad de usuarios de la App MAPPA que se muestra en el sitio.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_count">Número de usuarios</Label>
                <div className="flex gap-2">
                  <Input
                    id="user_count"
                    type="number"
                    min="0"
                    value={userCount || String(count)}
                    onChange={(e) => setUserCount(e.target.value)}
                    placeholder="0"
                    className="max-w-[200px]"
                  />
                  <Button 
                    onClick={handleSaveUserCount}
                    disabled={updateConfig.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateConfig.isPending ? 'Guardando...' : 'Guardar'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Este número se muestra en la página principal como "Usuarios de la App".
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-dashed">
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-2">
                ¿Necesitás más configuraciones?
              </h3>
              <p className="text-sm text-muted-foreground">
                Este panel se puede extender para incluir más ajustes según las necesidades 
                del proyecto, como información de contacto, enlaces de redes sociales, 
                textos personalizables, etc.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
