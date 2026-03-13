'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TarjetaAutenticacion } from '@/components/tarjeta-autenticacion';
import { usarNotificacion } from '@/hooks/usar-notificacion';
import { Loader2 } from 'lucide-react';

const resetSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingresa un correo electrónico válido.' }),
});

type ResetSchemaType = z.infer<typeof resetSchema>;

export default function PaginaRecuperarContrasena() {
  const { notificacion } = usarNotificacion();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ResetSchemaType>({
    resolver: zodResolver(resetSchema),
  });

  const handleReset: SubmitHandler<ResetSchemaType> = async ({ email }) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocurrió un error inesperado.');
      }

      notificacion({
        title: 'Solicitud Enviada',
        description: data.message,
      });

    } catch (error: any) {
      notificacion({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
        <form onSubmit={handleSubmit(handleReset)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Enlace
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}
