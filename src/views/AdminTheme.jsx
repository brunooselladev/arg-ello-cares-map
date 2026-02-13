import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useThemeConfig, useUpdateThemeConfig } from '@/hooks/useSiteConfig';
import { useToast } from '@/hooks/use-toast';
import { Palette, Save } from 'lucide-react';
export default function AdminTheme() {
    const { data: config, isLoading } = useThemeConfig();
    const updateTheme = useUpdateThemeConfig();
    const { toast } = useToast();
    const [color, setColor] = useState('#2d8f78');
    useEffect(() => {
        if (config?.primaryColor) {
            setColor(config.primaryColor);
        }
    }, [config?.primaryColor]);
    const handleSave = async () => {
        try {
            await updateTheme.mutateAsync(color);
            toast({ title: 'Tema actualizado correctamente' });
        }
        catch (error) {
            toast({
                title: 'Error al actualizar tema',
                description: error instanceof Error ? error.message : 'No se pudo guardar la configuracion.',
                variant: 'destructive',
            });
        }
    };
    return (<AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tema</h1>
          <p className="text-muted-foreground">Configura el color primario global del sitio.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5"/>
              Color principal
            </CardTitle>
            <CardDescription>
              Este color impacta en botones, acentos y componentes que usan la variable `--primary`.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (<p className="text-sm text-muted-foreground">Cargando configuracion...</p>) : (<>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Selecciona un color</Label>
                  <div className="flex items-center gap-3">
                    <input id="primary-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-20 rounded border bg-background cursor-pointer"/>
                    <code className="text-sm px-3 py-2 bg-muted rounded">{color}</code>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground mb-2">Vista previa</p>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 items-center rounded-md px-4 text-sm font-medium text-white" style={{ backgroundColor: color }}>
                      Boton primario
                    </span>
                    <span className="text-sm" style={{ color }}>
                      Texto de acento
                    </span>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={updateTheme.isPending}>
                  <Save className="mr-2 h-4 w-4"/>
                  {updateTheme.isPending ? 'Guardando...' : 'Guardar color'}
                </Button>
              </>)}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>);
}
