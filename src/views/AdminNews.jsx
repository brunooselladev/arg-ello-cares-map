import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateNews, useDeleteNews, useNews, useToggleNewsVisibility, useUpdateNews, } from '@/hooks/useNews';
import { NEWS_CATEGORY_LABELS } from '@/types/database';
const emptyForm = {
    title: '',
    content: '',
    summary: '',
    image: '',
    category: 'nodos',
    videoUrl: '',
    date: '',
    author: '',
    tags: '',
};
const categories = Object.keys(NEWS_CATEGORY_LABELS);
const parseTags = (raw) => {
    const tags = raw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    return tags.length > 0 ? tags : null;
};
const formatDateInput = (value) => {
    if (!value)
        return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return '';
    return date.toISOString().slice(0, 10);
};
export default function AdminNews() {
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [filterCategory, setFilterCategory] = useState('all');
    const { data: news = [], isLoading } = useNews(filterCategory === 'all' ? null : filterCategory, 200, true);
    const createNews = useCreateNews();
    const updateNews = useUpdateNews();
    const deleteNews = useDeleteNews();
    const toggleVisibility = useToggleNewsVisibility();
    const { toast } = useToast();
    const sortedNews = useMemo(() => {
        return [...news].sort((a, b) => {
            const aDate = new Date(a.date || a.createdAt).getTime();
            const bDate = new Date(b.date || b.createdAt).getTime();
            return bDate - aDate;
        });
    }, [news]);
    const handleClose = () => {
        setIsOpen(false);
        setEditingId(null);
        setForm(emptyForm);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: form.title,
            content: form.content,
            summary: form.summary,
            image: form.image || null,
            category: form.category,
            videoUrl: form.videoUrl || null,
            date: form.date || null,
            author: form.author || null,
            tags: parseTags(form.tags),
        };
        try {
            if (editingId) {
                await updateNews.mutateAsync({ id: editingId, ...payload });
                toast({ title: 'Novedad actualizada correctamente' });
            }
            else {
                await createNews.mutateAsync(payload);
                toast({ title: 'Novedad creada correctamente' });
            }
            handleClose();
        }
        catch (error) {
            toast({
                title: 'Error al guardar',
                description: error instanceof Error ? error.message : 'No se pudo guardar la novedad.',
                variant: 'destructive',
            });
        }
    };
    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm({
            title: item.title,
            content: item.content,
            summary: item.summary,
            image: item.image || '',
            category: (item.category || 'nodos'),
            videoUrl: item.videoUrl || '',
            date: formatDateInput(item.date),
            author: item.author || '',
            tags: item.tags?.join(', ') || '',
        });
        setIsOpen(true);
    };
    const handleDelete = async (id) => {
        if (!confirm('Estas seguro de eliminar esta novedad?'))
            return;
        try {
            await deleteNews.mutateAsync(id);
            toast({ title: 'Novedad eliminada' });
        }
        catch {
            toast({ title: 'Error al eliminar', variant: 'destructive' });
        }
    };
    const handleToggleVisibility = async (item) => {
        try {
            await toggleVisibility.mutateAsync({ id: item.id, visible: !item.visible });
            toast({ title: item.visible ? 'Novedad ocultada' : 'Novedad visible en Home' });
        }
        catch {
            toast({ title: 'No se pudo cambiar la visibilidad', variant: 'destructive' });
        }
    };
    return (<AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion de novedades</h1>
            <p className="text-muted-foreground">Crea, filtra y administra visibilidad de novedades.</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleClose()}>
                <Plus className="mr-2 h-4 w-4"/>
                Nueva novedad
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Editar novedad' : 'Nueva novedad'}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titulo *</Label>
                  <Input id="title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Resumen *</Label>
                  <Textarea id="summary" value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} required rows={2}/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido *</Label>
                  <Textarea id="content" value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} required rows={6}/>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={form.category} onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (<SelectItem key={category} value={category}>
                            {NEWS_CATEGORY_LABELS[category]}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input id="date" type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}/>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Imagen (URL/base64)</Label>
                    <Input id="image" value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} placeholder="https://..."/>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input id="videoUrl" value={form.videoUrl} onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value }))} placeholder="https://youtube.com/..."/>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Autor</Label>
                    <Input id="author" value={form.author} onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}/>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separados por coma)</Label>
                    <Input id="tags" value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} placeholder="salud, barrio, red"/>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createNews.isPending || updateNews.isPending}>
                    {editingId ? 'Guardar cambios' : 'Crear novedad'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-4 border-b">
            <div className="max-w-xs">
              <Label htmlFor="category-filter">Filtrar por categoria</Label>
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value)}>
                <SelectTrigger id="category-filter" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (<SelectItem key={category} value={category}>
                      {NEWS_CATEGORY_LABELS[category]}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardContent className="p-0">
            {isLoading ? (<div className="p-8 text-center text-muted-foreground">Cargando...</div>) : sortedNews.length === 0 ? (<div className="p-8 text-center text-muted-foreground">No hay novedades para el filtro seleccionado.</div>) : (<Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titulo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[170px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedNews.map((item) => (<TableRow key={item.id}>
                      <TableCell className="font-medium max-w-[320px] truncate">{item.title}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                          {NEWS_CATEGORY_LABELS[(item.category || 'nodos')]}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.date ? format(new Date(item.date), 'd MMM yyyy', { locale: es }) : '-'}
                      </TableCell>
                      <TableCell>
                        {item.visible ? (<span className="inline-flex items-center gap-1 text-green-600 text-sm">
                            <Eye className="h-3 w-3"/> Visible
                          </span>) : (<span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                            <EyeOff className="h-3 w-3"/> Oculta
                          </span>)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleToggleVisibility(item)} title={item.visible ? 'Ocultar en Home' : 'Mostrar en Home'}>
                            {item.visible ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                            <Pencil className="h-4 w-4"/>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>)}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>);
}
