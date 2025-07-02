'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TarjetaAutenticacion } from '@/components/tarjeta-autenticacion';
import { usarNotificacion } from '@/hooks/usar-notificacion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function PaginaRecuperarContrasena() {
  const { notificacion } = usarNotificacion();
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCargando(true);

    if (!auth) {
      notificacion({
        title: 'Configuración Requerida',
        description: 'La autenticación de Firebase no está configurada en el archivo .env.',
        variant: 'destructive',
      });
      setCargando(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      notificacion({
        title: 'Correo Enviado',
        description: 'Si la cuenta existe, recibirás un enlace para recuperar tu contraseña.',
      });
    } catch (error: any) {
      console.error("Error al enviar correo de recuperación:", error);
       notificacion({
        title: 'Error',
        description: 'No se pudo enviar el correo de recuperación. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
        setCargando(false);
    }
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
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={cargando} />
          </div>
          <Button type="submit" className="w-full" disabled={cargando}>
             {cargando ? <Loader2 className="animate-spin" /> : 'Enviar Enlace'}
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}
