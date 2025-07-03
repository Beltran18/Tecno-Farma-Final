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

const registroSchema = z.object({
  nombre: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  email: z.string().email({ message: 'Correo electrónico no válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type RegistroSchemaType = z.infer<typeof registroSchema>;

export default function PaginaRegistro() {
  const router = useRouter();
  const { user, register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { notificacion } = usarNotificacion();

  const { register, handleSubmit, formState: { errors } } = useForm<RegistroSchemaType>({
    resolver: zodResolver(registroSchema),
  });

  useEffect(() => {
    if (user) {
      router.push('/panel');
    }
  }, [user, router]);

  const handleSignup: SubmitHandler<RegistroSchemaType> = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data.nombre, data.email, data.password);
    } catch (error: any) {
      notificacion({
        title: 'Error en el registro',
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
        title="Crear una Cuenta"
        description="Ingresa tus datos para registrarte."
        footer={
          <div className="text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              Inicia Sesión
            </Link>
          </div>
        }
      >
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input id="name" type="text" placeholder="Tu Nombre" {...register('nombre')} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Cuenta
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}
