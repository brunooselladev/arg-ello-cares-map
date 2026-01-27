import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { useMapPoints, useCreateMapPoint, useUpdateMapPoint, useDeleteMapPoint } from '@/hooks/useMapPoints';
import { MapPointType, MAP_POINT_LABELS, MAP_POINT_COLORS } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const emptyForm = {
  name: '',
  description: '',
  latitude: '',
  longitude: '',
  point_type: 'nodo' as MapPointType,
  address: '',
  phone: '',
  email: '',
  is_active: true,
};

export default function AdminMapPoints() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: points = [], isLoading } = useMapPoints();
  const createPoint = useCreateMapPoint();
  const updatePoint = useUpdateMapPoint();
  const deletePoint = useDeleteMapPoint();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: form.name,
      description: form.description || null,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      point_type: form.point_type,
      address: form.address || null,
      phone: form.phone || null,
      email: form.email || null,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await updatePoint.mutateAsync({ id: editingId, ...data });
        toast({ title: 'Punto actualizado correctamente' });
      } else {
        await createPoint.mutateAsync(data);
        toast({ title: 'Punto creado correctamente' });
      }
      handleClose();
    } catch (error) {
      toast({ title: 'Error al guardar', variant: 'destructive' });
    }
  };

  const handleEdit = (point: typeof points[0]) => {
    setEditingId(point.id);
    setForm({
      name: point.name,
      description: point.description || '',
      latitude: String(point.latitude),
      longitude: String(point.longitude),
      point_type: point.point_type,
      address: point.address || '',
      phone: point.phone || '',
      email: point.email || '',
      is_active: point.is_active,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este punto?')) return;
    
    try {
      await deletePoint.mutateAsync(id);
      toast({ title: 'Punto eliminado' });
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
            <h1 className="text-2xl font-bold text-foreground">Gestión del Mapa</h1>
            <p className="text-muted-foreground">
              Administrá los puntos de interés que aparecen en el mapa interactivo.
            </p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Punto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Punto' : 'Nuevo Punto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="point_type">Tipo *</Label>
                  <Select
                    value={form.point_type}
                    onValueChange={(v) => setForm({ ...form, point_type: v as MapPointType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MAP_POINT_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitud *</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={form.latitude}
                      onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                      placeholder="-31.3856"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitud *</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={form.longitude}
                      onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                      placeholder="-64.2325"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Activo (visible en el mapa)</Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createPoint.isPending || updatePoint.isPending}>
                    {editingId ? 'Guardar Cambios' : 'Crear Punto'}
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
            ) : points.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay puntos creados. Creá el primero haciendo clic en "Nuevo Punto".
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {points.map((point) => (
                    <TableRow key={point.id}>
                      <TableCell className="font-medium">{point.name}</TableCell>
                      <TableCell>
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                          MAP_POINT_COLORS[point.point_type],
                          'text-white'
                        )}>
                          <MapPin className="h-3 w-3" />
                          {MAP_POINT_LABELS[point.point_type]}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {point.address || '-'}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs',
                          point.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        )}>
                          {point.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(point)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(point.id)}
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
