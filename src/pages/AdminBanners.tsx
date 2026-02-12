import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBanners, useCreateBanner, useDeleteBanner } from '@/hooks/useBanners';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, Trash2, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminBanners() {
  const { data: banners = [], isLoading } = useBanners();
  const createBanner = useCreateBanner();
  const deleteBanner = useDeleteBanner();
  const { toast } = useToast();

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const maxReached = banners.length >= 3;

  const previewSrc = useMemo(() => selectedImage || imageUrlInput.trim() || null, [selectedImage, imageUrlInput]);

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateBanner = async () => {
    const payload = selectedImage || imageUrlInput.trim();

    if (!payload) {
      toast({ title: 'Debes seleccionar una imagen o URL.', variant: 'destructive' });
      return;
    }

    try {
      await createBanner.mutateAsync(payload);
      toast({ title: 'Banner creado correctamente' });
      setImageUrlInput('');
      setSelectedImage(null);
    } catch (error: unknown) {
      toast({
        title: 'Error al crear banner',
        description: error instanceof Error ? error.message : 'No se pudo guardar el banner.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Estas seguro de eliminar este banner?')) return;

    try {
      await deleteBanner.mutateAsync(id);
      toast({ title: 'Banner eliminado' });
    } catch {
      toast({ title: 'No se pudo eliminar el banner.', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banners</h1>
          <p className="text-muted-foreground">Administra imagenes del carousel principal (maximo 3).</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5" />
              Cargar banner
            </CardTitle>
            <CardDescription>
              Puedes subir un archivo o pegar una URL. Si hay 3 banners, el upload se bloquea.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banner-file">Subir archivo</Label>
                <Input
                  id="banner-file"
                  type="file"
                  accept="image/*"
                  disabled={maxReached || createBanner.isPending}
                  onChange={handleSelectFile}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-url">O pegar URL</Label>
                <Input
                  id="banner-url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://..."
                  disabled={maxReached || createBanner.isPending}
                />
              </div>
            </div>

            {previewSrc && (
              <div className="rounded-lg overflow-hidden border max-w-lg">
                <img src={previewSrc} alt="Preview" className="w-full h-56 object-cover" />
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button onClick={handleCreateBanner} disabled={maxReached || createBanner.isPending}>
                <UploadCloud className="mr-2 h-4 w-4" />
                {createBanner.isPending ? 'Subiendo...' : 'Guardar banner'}
              </Button>
              <span className="text-sm text-muted-foreground">{banners.length}/3 banners</span>
            </div>

            {maxReached && (
              <p className="text-sm text-amber-600">Ya alcanzaste el limite de 3 banners. Elimina uno para continuar.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banners actuales</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando banners...</p>
            ) : banners.length === 0 ? (
              <p className="text-muted-foreground">No hay banners cargados.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="rounded-lg border overflow-hidden bg-card">
                    <img src={banner.imageUrl} alt="Banner" className="w-full h-40 object-cover" />
                    <div className="p-3 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Creado: {format(new Date(banner.createdAt), 'd MMM yyyy, HH:mm', { locale: es })}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

