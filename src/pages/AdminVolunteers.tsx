import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useVolunteers } from '@/hooks/useForms';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users, Mail, Phone, Clock } from 'lucide-react';

export default function AdminVolunteers() {
  const { data: volunteers = [], isLoading } = useVolunteers();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Voluntarios</h1>
          <p className="text-muted-foreground">
            Listado de personas que se registraron para ser voluntarias.
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Cargando...</div>
            ) : volunteers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay voluntarios registrados aún.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Disponibilidad</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((vol) => (
                    <TableRow key={vol.id}>
                      <TableCell className="font-medium">{vol.full_name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <a href={`mailto:${vol.email}`} className="hover:text-primary">
                              {vol.email}
                            </a>
                          </div>
                          {vol.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {vol.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {vol.availability ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {vol.availability}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {vol.message ? (
                          <p className="text-sm text-muted-foreground truncate" title={vol.message}>
                            {vol.message}
                          </p>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(vol.created_at), "d MMM yyyy", { locale: es })}
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
