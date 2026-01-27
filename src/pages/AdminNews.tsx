import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from '@/hooks/useNews';
import { NewsSection, NEWS_SECTION_LABELS } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const emptyForm = {
  title: '',
  content: '',
  excerpt: '',
  image_url: '',
  image_caption: '',
  section: 'nodos' as NewsSection,
  is_visible: true,
  published_at: new Date().toISOString(),
};

export default function AdminNews() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: news = [], isLoading } = useNews();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      title: form.title,
      content: form.content,
      excerpt: form.excerpt || null,
      image_url: form.image_url || null,
      image_caption: form.image_caption || null,
      section: form.section,
      is_visible: form.is_visible,
      published_at: form.published_at,
    };

    try {
      if (editingId) {
        await updateNews.mutateAsync({ id: editingId, ...data });
        toast({ title: 'Novedad actualizada correctamente' });
      } else {
        await createNews.mutateAsync(data);
        toast({ title: 'Novedad creada correctamente' });
      }
      handleClose();
    } catch (error) {
      toast({ title: 'Error al guardar', variant: 'destructive' });
    }
  };

  const handleEdit = (item: typeof news[0]) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || '',
      image_url: item.image_url || '',
      image_caption: item.image_caption || '',
      section: item.section,
      is_visible: item.is_visible,
      published_at: item.published_at,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta novedad?')) return;
    
    try {
      await deleteNews.mutateAsync(id);
      toast({ title: 'Novedad eliminada' });
    } catch (error) {
      toast({ title: 'Error al eliminar', variant: 'destructive' });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Novedades</h1>
            <p className="text-muted-foreground">
              Administrá las novedades y noticias de cada sección.
            </p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Novedad
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Novedad' : 'Nueva Novedad'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Sección *</Label>
                  <Select
                    value={form.section}
                    onValueChange={(v) => setForm({ ...form, section: v as NewsSection })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(NEWS_SECTION_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Extracto (resumen breve)</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={2}
                    placeholder="Un breve resumen que aparecerá en las tarjetas..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido *</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">URL de Imagen</Label>
                  <Input
                    id="image_url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_caption">Epígrafe de la Imagen</Label>
                  <Input
                    id="image_caption"
                    value={form.image_caption}
                    onChange={(e) => setForm({ ...form, image_caption: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_visible"
                    checked={form.is_visible}
                    onCheckedChange={(checked) => setForm({ ...form, is_visible: checked })}
                  />
                  <Label htmlFor="is_visible">Visible en el sitio</Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createNews.isPending || updateNews.isPending}>
                    {editingId ? 'Guardar Cambios' : 'Crear Novedad'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Cargando...</div>
            ) : news.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay novedades creadas. Creá la primera haciendo clic en "Nueva Novedad".
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Sección</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium max-w-[300px] truncate">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                          {NEWS_SECTION_LABELS[item.section]}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(item.published_at), "d MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        {item.is_visible ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <Eye className="h-3 w-3" /> Visible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <EyeOff className="h-3 w-3" /> Oculto
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
