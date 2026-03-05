import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Image, Video } from 'lucide-react';
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const emptyForm = {
    title: '',
    description: '',
    media_type: 'image',
    image_url: '',
    video_url: '',
    link_url: '',
    is_active: true,
    start_date: '',
    end_date: '',
};
export default function AdminCampaigns() {
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const { data: campaigns = [], isLoading } = useCampaigns();
    const createCampaign = useCreateCampaign();
    const updateCampaign = useUpdateCampaign();
    const deleteCampaign = useDeleteCampaign();
    const { toast } = useToast();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.media_type === 'image' && !form.image_url.trim()) {
            toast({ title: 'Ingresá una URL de imagen', variant: 'destructive' });
            return;
        }
        if (form.media_type === 'video' && !form.video_url.trim()) {
            toast({ title: 'Ingresá una URL de video', variant: 'destructive' });
            return;
        }
        const data = {
            title: form.title,
            description: form.description || null,
            media_type: form.media_type,
            image_url: form.media_type === 'image' ? (form.image_url || null) : null,
            video_url: form.media_type === 'video' ? (form.video_url || null) : null,
            link_url: form.link_url || null,
            is_active: form.is_active,
            start_date: form.start_date || null,
            end_date: form.end_date || null,
        };
        try {
            if (editingId) {
                await updateCampaign.mutateAsync({ id: editingId, ...data });
                toast({ title: 'Campaña actualizada correctamente' });
            }
            else {
                await createCampaign.mutateAsync(data);
                toast({ title: 'Campaña creada correctamente' });
            }
            handleClose();
        }
        catch (error) {
            toast({ title: 'Error al guardar', variant: 'destructive' });
        }
    };
    const handleEdit = (campaign) => {
        setEditingId(campaign.id);
        setForm({
            title: campaign.title,
            description: campaign.description || '',
            media_type: campaign.media_type || (campaign.video_url ? 'video' : 'image'),
            image_url: campaign.image_url || '',
            video_url: campaign.video_url || '',
            link_url: campaign.link_url || '',
            is_active: campaign.is_active,
            start_date: campaign.start_date || '',
            end_date: campaign.end_date || '',
        });
        setIsOpen(true);
    };
    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta campaña?'))
            return;
        try {
            await deleteCampaign.mutateAsync(id);
            toast({ title: 'Campaña eliminada' });
        }
        catch (error) {
            toast({ title: 'Error al eliminar', variant: 'destructive' });
        }
    };
    const handleClose = () => {
        setIsOpen(false);
        setEditingId(null);
        setForm(emptyForm);
    };
    return (<AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Campañas</h1>
            <p className="text-muted-foreground">
              Administrá las campañas de la organización.
            </p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                <Plus className="mr-2 h-4 w-4"/>
                Nueva Campaña
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Campaña' : 'Nueva Campaña'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="media_type">Tipo de medio *</Label>
                  <Select value={form.media_type} onValueChange={(v) => setForm({ ...form, media_type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image"><span className="flex items-center gap-2"><Image className="h-4 w-4"/>Imagen</span></SelectItem>
                      <SelectItem value="video"><span className="flex items-center gap-2"><Video className="h-4 w-4"/>Video</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.media_type === 'image' && (
                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL de Imagen *</Label>
                    <Input id="image_url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..."/>
                  </div>
                )}

                {form.media_type === 'video' && (
                  <div className="space-y-2">
                    <Label htmlFor="video_url">URL de Video *</Label>
                    <Input id="video_url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..."/>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="link_url">Link externo (opcional)</Label>
                  <Input id="link_url" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://..."/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Fecha inicio</Label>
                    <Input id="start_date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Fecha fin</Label>
                    <Input id="end_date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}/>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="is_active" checked={form.is_active} onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}/>
                  <Label htmlFor="is_active">Activa (visible en el sitio)</Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createCampaign.isPending || updateCampaign.isPending}>
                    {editingId ? 'Guardar Cambios' : 'Crear Campaña'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (<div className="p-8 text-center text-muted-foreground">Cargando...</div>) : campaigns.length === 0 ? (<div className="p-8 text-center text-muted-foreground">
                No hay campañas creadas. Creá la primera haciendo clic en Nueva Campana.
              </div>) : (<Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Medio</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (<TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.title}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[300px] truncate">
                        {campaign.description || '-'}
                      </TableCell>
                      <TableCell>
                        <span className={cn('px-2 py-1 rounded-full text-xs', campaign.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600')}>
                          {campaign.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(campaign)}>
                            <Pencil className="h-4 w-4"/>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(campaign.id)}>
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

