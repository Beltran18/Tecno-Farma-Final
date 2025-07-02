'use client';

import Link from 'next/link';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { TarjetaAutenticacion } from '@/componentes/tarjeta-autenticacion';
import { usarNotificacion } from '@/hooks/usar-notificacion';

export default function PaginaRecuperarContrasena() {
  const { notificacion } = usarNotificacion();

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    notificacion({
      title: 'Correo Enviado',
      description: 'Si la cuenta existe, recibirás un enlace para recuperar tu contraseña.',
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <TarjetaAutenticacion
        title="Recuperar Contraseña"
        description="Ingresa tu correo para recibir un enlace de recuperación."
        footer={
          <div className="text-center text-sm">
            <Link href="/" className="font-medium text-primary hover:underline">
              Volver a Iniciar Sesión
            </Link>
          </div>
        }
      >
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" required />
          </div>
          <Button type="submit" className="w-full">
            Enviar Enlace
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}
