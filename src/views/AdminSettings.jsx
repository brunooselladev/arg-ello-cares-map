import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, ImageIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
export default function AdminSettings() {
    return (<AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuracion</h1>
          <p className="text-muted-foreground">Ajustes generales del sitio.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5"/>
              Banners
            </CardTitle>
            <CardDescription>Gestiona las imagenes del carousel principal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/banners" className="inline-flex items-center text-primary hover:underline">
              Ir a Banners <ArrowRight className="ml-1 h-4 w-4"/>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5"/>
              Tema
            </CardTitle>
            <CardDescription>Define el color primario global del sitio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/theme" className="inline-flex items-center text-primary hover:underline">
              Ir a Tema <ArrowRight className="ml-1 h-4 w-4"/>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>);
}

