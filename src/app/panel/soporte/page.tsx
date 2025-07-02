'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { usarNotificacion } from '@/hooks/usar-notificacion';
import { LifeBuoy } from 'lucide-react';

export default function PaginaSoporte() {
  const { notificacion } = usarNotificacion();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);

    // Simulación de envío de solicitud
    setTimeout(() => {
      notificacion({
        title: 'Solicitud Enviada',
        description: 'Hemos recibido tu mensaje. El equipo de soporte se pondrá en contacto contigo pronto.',
      });
      setNombre('');
      setEmail('');
      setAsunto('');
      setMensaje('');
      setEnviando(false);
    }, 1500);
  };

  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
             <LifeBuoy className="h-8 w-8 text-primary" />
             <div>
                <CardTitle>Soporte Técnico</CardTitle>
                <CardDescription>
                  ¿Necesitas ayuda? Completa el formulario y nos pondremos en contacto.
                </CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" placeholder="Tu nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="asunto">Asunto</Label>
              <Input id="asunto" placeholder="Ej: Problema con el inventario" value={asunto} onChange={(e) => setAsunto(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea
                id="mensaje"
                placeholder="Describe tu problema o consulta en detalle..."
                className="min-h-[150px]"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
