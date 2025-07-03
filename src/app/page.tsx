'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TarjetaAutenticacion } from '@/components/tarjeta-autenticacion';
import { useAuth } from '@/context/auth-provider';
import { Loader2 } from 'lucide-react';
import { usarNotificacion } from '@/hooks/usar-notificacion';

const loginSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico no válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function PaginaInicioSesion() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { notificacion } = usarNotificacion();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      router.push('/panel');
    }
  }, [user, router]);

  const handleLogin: SubmitHandler<LoginSchemaType> = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      notificacion({
        title: 'Error de autenticación',
        description: error.message || 'Ocurrió un error inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <TarjetaAutenticacion
        title="Iniciar Sesión"
        description="Bienvenido de nuevo a TecnoFarma."
        footer={
          <div className="text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="/registro" className="font-medium text-primary hover:underline">
              Regístrate
            </Link>
          </div>
        }
      >
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="/recuperar-contrasena" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar Sesión
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}
