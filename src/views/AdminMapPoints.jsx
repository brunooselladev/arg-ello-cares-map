/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { useMapPoints, useCreateMapPoint, useUpdateMapPoint, useDeleteMapPoint } from '@/hooks/useMapPoints';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { MAP_POINT_LABELS, MAP_POINT_COLORS } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ORGANIZATION_TYPES = [
  'Estatal',
  'Comunitaria',
  'Educación',
  'Merendero o comedor',
  'Deportiva',
  'Religiosa',
  'Centro vecinal',
  'Salud',
];

const TARGET_POPULATIONS = [
  'Niñeces',
  'Adolescentes',
  'Jóvenes',
  'Adultos',
  'Adultos mayores',
  'Familia',
];

const CONFIRMATION_OPTIONS = [
  'Conversación previa para acordar cuándo y cómo',
  'Sólo con aviso por whatsapp',
  'actividad abierta sin necesidad de confirmación',
];

const emptyActivity = {
  name: '',
  activity_type: 'principal',
  description: '',
  schedule: '',
  confirmation: '',
  confirmation_other: '',
};

const emptyForm = {
  name: '',
  description: '',
  phone: '',
  organization_types: [],
  organization_type_other: '',
  address: '',
  latitude: '',
  longitude: '',
  barrio: '',
  has_internet: '',
  has_device: '',
  responsible: '',
  target_populations: [],
  email: '',
  point_type: 'nodo',
  is_active: true,
  activities: [],
};

function CheckboxGroup({ label, options, selected, onChange, otherValue, onOtherChange }) {
  const toggle = (opt) =>
    onChange(selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2 mt-1">
        {options.map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <Checkbox
              id={`chk-${opt}`}
              checked={selected.includes(opt)}
              onCheckedChange={() => toggle(opt)}
            />
            <label htmlFor={`chk-${opt}`} className="text-sm cursor-pointer">{opt}</label>
          </div>
        ))}
        {onOtherChange !== undefined && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="chk-other"
              checked={!!otherValue}
              onCheckedChange={(checked) => { if (!checked) onOtherChange(''); }}
            />
            <label htmlFor="chk-other" className="text-sm">Other:</label>
            <Input
              className="h-7 text-sm flex-1"
              value={otherValue ?? ''}
              onChange={(e) => onOtherChange(e.target.value)}
              placeholder="Especificar..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function YesNoRadio({ label, value, onChange, required }) {
  return (
    <div className="space-y-2">
      <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-4 mt-1">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="si" id={`radio-si-${label}`} />
          <label htmlFor={`radio-si-${label}`} className="text-sm cursor-pointer">Sí</label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="no" id={`radio-no-${label}`} />
          <label htmlFor={`radio-no-${label}`} className="text-sm cursor-pointer">No</label>
        </div>
      </RadioGroup>
    </div>
  );
}

function ActivityForm({ activity, index, onChange, onRemove }) {
  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Actividad {index + 1}</h4>
        <Button type="button" variant="ghost" size="icon" className="text-destructive h-7 w-7" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        <Label className="text-sm">¿Qué nombre tiene la actividad? ¿Cómo le llaman usualmente?</Label>
        <Input
          value={activity.name}
          onChange={(e) => onChange({ ...activity, name: e.target.value })}
          placeholder="Nombre de la actividad"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-sm">Tipo de Actividad</Label>
        <RadioGroup
          value={activity.activity_type}
          onValueChange={(v) => onChange({ ...activity, activity_type: v })}
          className="flex gap-4 mt-1"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="principal" id={`at-principal-${index}`} />
            <label htmlFor={`at-principal-${index}`} className="text-sm cursor-pointer">Principal</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="secundaria" id={`at-secundaria-${index}`} />
            <label htmlFor={`at-secundaria-${index}`} className="text-sm cursor-pointer">Secundaria</label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-1">
        <Label className="text-sm">Descripción de lo que ofrece y a quién está dirigido</Label>
        <Textarea
          value={activity.description}
          onChange={(e) => onChange({ ...activity, description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-sm">Días y horarios</Label>
        <Input
          value={activity.schedule}
          onChange={(e) => onChange({ ...activity, schedule: e.target.value })}
          placeholder="Ej: Lunes y miércoles de 9 a 12hs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">
          En caso de que referenciemos a una persona para que participe de esta actividad,
          ¿qué forma de confirmar que efectivamente puede participar proponen?
        </Label>
        <RadioGroup
          value={activity.confirmation}
          onValueChange={(v) => onChange({ ...activity, confirmation: v, confirmation_other: v !== 'other' ? '' : activity.confirmation_other })}
          className="space-y-2 mt-1"
        >
          {CONFIRMATION_OPTIONS.map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <RadioGroupItem value={opt} id={`conf-${index}-${opt}`} />
              <label htmlFor={`conf-${index}-${opt}`} className="text-sm cursor-pointer">{opt}</label>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <RadioGroupItem value="other" id={`conf-${index}-other`} />
            <label htmlFor={`conf-${index}-other`} className="text-sm">Other:</label>
            <Input
              className="h-7 text-sm flex-1"
              value={activity.confirmation_other}
              onChange={(e) => onChange({ ...activity, confirmation: 'other', confirmation_other: e.target.value })}
              placeholder="Especificar..."
            />
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

export default function AdminMapPoints() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);

  const { data: points = [], isLoading } = useMapPoints();
  const createPoint = useCreateMapPoint();
  const updatePoint = useUpdateMapPoint();
  const deletePoint = useDeleteMapPoint();
  const { toast } = useToast();

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleActivityChange = (index, updated) =>
    setField('activities', form.activities.map((a, i) => (i === index ? updated : a)));

  const handleAddActivity = () =>
    setField('activities', [...form.activities, { ...emptyActivity }]);

  const handleRemoveActivity = (index) =>
    setField('activities', form.activities.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      toast({ title: 'Por favor seleccioná una dirección de las sugerencias', variant: 'destructive' });
      return;
    }

    const data = {
      name: form.name,
      description: form.description || null,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      point_type: form.point_type,
      address: form.address || null,
      barrio: form.barrio || null,
      phone: form.phone || null,
      email: form.email || null,
      responsible: form.responsible || null,
      organization_types: [
        ...form.organization_types,
        ...(form.organization_type_other ? [form.organization_type_other] : []),
      ],
      target_populations: form.target_populations,
      has_internet: form.has_internet === 'si',
      has_device: form.has_device === 'si',
      is_active: form.is_active,
      activities: form.activities,
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
    } catch {
      toast({ title: 'Error al guardar', variant: 'destructive' });
    }
  };

  const handleEdit = (point) => {
    setEditingId(point.id);
    setForm({
      name: point.name,
      description: point.description || '',
      phone: point.phone || '',
      organization_types: point.organization_types || [],
      organization_type_other: '',
      address: point.address || '',
      latitude: String(point.latitude),
      longitude: String(point.longitude),
      barrio: point.barrio || '',
      has_internet: point.has_internet === true ? 'si' : point.has_internet === false ? 'no' : '',
      has_device: point.has_device === true ? 'si' : point.has_device === false ? 'no' : '',
      responsible: point.responsible || '',
      target_populations: point.target_populations || [],
      email: point.email || '',
      point_type: point.point_type,
      is_active: point.is_active,
      activities: point.activities || [],
    });
    setStep(1);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este punto?')) return;
    try {
      await deletePoint.mutateAsync(id);
      toast({ title: 'Punto eliminado' });
    } catch {
      toast({ title: 'Error al eliminar', variant: 'destructive' });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setStep(1);
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
              <Button onClick={() => { setEditingId(null); setForm(emptyForm); setStep(1); }}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Punto
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Punto' : 'Nuevo Punto'} — Paso {step} de 2
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">1. Nombre espacio</Label>
                      <Input id="name" value={form.name} onChange={(e) => setField('name', e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción breve</Label>
                      <Textarea id="description" value={form.description} onChange={(e) => setField('description', e.target.value)} rows={3} placeholder="Breve descripción del espacio..." />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">2. Teléfono <span className="text-destructive">*</span></Label>
                      <Input id="phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} required />
                    </div>

                    <CheckboxGroup
                      label="3. Tipo de organización *"
                      options={ORGANIZATION_TYPES}
                      selected={form.organization_types}
                      onChange={(v) => setField('organization_types', v)}
                      otherValue={form.organization_type_other}
                      onOtherChange={(v) => setField('organization_type_other', v)}
                    />

                    <div className="space-y-2">
                      <Label>4. Dirección <span className="text-destructive">*</span></Label>
                      <AddressAutocomplete
                        value={form.address}
                        onChange={(text) => setForm((p) => ({ ...p, address: text, latitude: '', longitude: '' }))}
                        onSelect={({ address, latitude, longitude }) =>
                          setForm((p) => ({ ...p, address, latitude: String(latitude), longitude: String(longitude) }))
                        }
                        placeholder="Buscar dirección..."
                      />
                      {form.latitude && form.longitude && (
                        <p className="text-xs text-muted-foreground">
                          📍 {parseFloat(form.latitude).toFixed(5)}, {parseFloat(form.longitude).toFixed(5)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="barrio">5. Barrio <span className="text-destructive">*</span></Label>
                      <Input id="barrio" value={form.barrio} onChange={(e) => setField('barrio', e.target.value)} required />
                    </div>

                    <YesNoRadio
                      label="6. ¿Cuenta con internet?"
                      value={form.has_internet}
                      onChange={(v) => setField('has_internet', v)}
                      required
                    />

                    <YesNoRadio
                      label="7. ¿Cuenta con dispositivo móvil/computadora?"
                      value={form.has_device}
                      onChange={(v) => setField('has_device', v)}
                      required
                    />

                    <div className="space-y-2">
                      <Label htmlFor="responsible">8. ¿Quién o quiénes están a cargo? <span className="text-destructive">*</span></Label>
                      <Input id="responsible" value={form.responsible} onChange={(e) => setField('responsible', e.target.value)} required />
                    </div>

                    <CheckboxGroup
                      label="9. Población a la que dirigen su propuesta *"
                      options={TARGET_POPULATIONS}
                      selected={form.target_populations}
                      onChange={(v) => setField('target_populations', v)}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="point_type">Tipo de punto en el mapa *</Label>
                      <Select value={form.point_type} onValueChange={(v) => setField('point_type', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(MAP_POINT_LABELS)
                            .filter(([value]) => value !== 'comunidad_practicas')
                            .map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch id="is_active" checked={form.is_active} onCheckedChange={(checked) => setField('is_active', checked)} />
                      <Label htmlFor="is_active">Activo (visible en el mapa)</Label>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setStep(2)}>
                        Siguiente: Actividades <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Cargá las actividades que ofrece el espacio. El número de actividades es ilimitado.
                    </p>

                    {form.activities.length === 0 && (
                      <p className="text-sm text-center text-muted-foreground py-4">
                        No hay actividades cargadas. Hacé clic en "Agregar actividad".
                      </p>
                    )}

                    <div className="space-y-4">
                      {form.activities.map((act, i) => (
                        <ActivityForm
                          key={i}
                          activity={act}
                          index={i}
                          onChange={(updated) => handleActivityChange(i, updated)}
                          onRemove={() => handleRemoveActivity(i)}
                        />
                      ))}
                    </div>

                    <Button type="button" variant="outline" className="w-full" onClick={handleAddActivity}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar actividad
                    </Button>

                    <div className="flex gap-2 justify-between pt-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Volver
                      </Button>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createPoint.isPending || updatePoint.isPending}>
                          {editingId ? 'Guardar Cambios' : 'Crear Punto'}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
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
                No hay puntos creados. Creá el primero haciendo clic en Nuevo Punto.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Barrio</TableHead>
                    <TableHead>Actividades</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {points.map((point) => (
                    <TableRow key={point.id}>
                      <TableCell className="font-medium">{point.name}</TableCell>
                      <TableCell>
                        <span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', MAP_POINT_COLORS[point.point_type], 'text-white')}>
                          <MapPin className="h-3 w-3" />
                          {MAP_POINT_LABELS[point.point_type]}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{point.address || '-'}</TableCell>
                      <TableCell className="text-muted-foreground">{point.barrio || '-'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {point.activities?.length ? `${point.activities.length} actividad(es)` : '-'}
                      </TableCell>
                      <TableCell>
                        <span className={cn('px-2 py-1 rounded-full text-xs', point.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                          {point.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(point)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(point.id)}>
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