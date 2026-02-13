import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useContactMessages, useMarkMessageRead } from '@/hooks/useForms';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Mail, Eye, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
export default function AdminMessages() {
    const { data: messages = [], isLoading } = useContactMessages();
    const markAsRead = useMarkMessageRead();
    const [selectedMessage, setSelectedMessage] = useState(null);
    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        if (!message.is_read) {
            await markAsRead.mutateAsync(message.id);
        }
    };
    return (<AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mensajes de Contacto</h1>
          <p className="text-muted-foreground">
            Mensajes recibidos a través del formulario de contacto.
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (<div className="p-8 text-center text-muted-foreground">Cargando...</div>) : messages.length === 0 ? (<div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                <p>No hay mensajes recibidos aún.</p>
              </div>) : (<Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>De</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (<TableRow key={msg.id} className={cn(!msg.is_read && 'bg-primary/5')}>
                      <TableCell>
                        {msg.is_read ? (<CheckCircle className="h-4 w-4 text-muted-foreground"/>) : (<div className="h-2 w-2 rounded-full bg-primary"/>)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className={cn('font-medium', !msg.is_read && 'font-semibold')}>
                            {msg.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{msg.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className={cn(!msg.is_read && 'font-medium')}>
                        {msg.subject || '(Sin asunto)'}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-muted-foreground truncate">
                          {msg.message}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(msg.created_at), "d MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleViewMessage(msg)}>
                          <Eye className="h-4 w-4"/>
                        </Button>
                      </TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>)}
          </CardContent>
        </Card>

        {/* Message Detail Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Mensaje de {selectedMessage?.name}</DialogTitle>
            </DialogHeader>
            {selectedMessage && (<div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4"/>
                  <a href={`mailto:${selectedMessage.email}`} className="hover:text-primary">
                    {selectedMessage.email}
                  </a>
                </div>

                {selectedMessage.subject && (<div>
                    <p className="text-sm font-medium text-muted-foreground">Asunto</p>
                    <p className="text-foreground">{selectedMessage.subject}</p>
                  </div>)}

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Mensaje</p>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Recibido el {format(new Date(selectedMessage.created_at), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                </div>

                <div className="flex justify-end">
                  <Button asChild>
                    <a href={`mailto:${selectedMessage.email}`}>
                      <Mail className="mr-2 h-4 w-4"/>
                      Responder
                    </a>
                  </Button>
                </div>
              </div>)}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>);
}
