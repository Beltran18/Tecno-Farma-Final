
'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TarjetaAutenticacion } from '@/components/tarjeta-autenticacion';
import { usarNotificacion } from '@/hooks/usar-notificacion';
import { Loader2 } from 'lucide-react';

const nuevaContrasenaSchema = z.object({
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

type NuevaContrasenaSchemaType = z.infer<typeof nuevaContrasenaSchema>;

function NuevaContrasenaComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { notificacion } = usarNotificacion();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<NuevaContrasenaSchemaType>({
    resolver: zodResolver(nuevaContrasenaSchema),
  });

  const handleReset: SubmitHandler<NuevaContrasenaSchemaType> = async (data) => {
    setIsLoading(true);

    // En una aplicación real, aquí llamarías a una API para verificar el token
    // y actualizar la contraseña en la base de datos.
    console.log('--- SIMULACIÓN DE CAMBIO DE CONTRASEÑA ---');
    console.log(`Token recibido: ${token}`);
    console.log(`Nueva contraseña (simulada): ${data.password}`);
    console.log('-------------------------------------------');

    // Simulamos un pequeño retraso de la API
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    
    notificacion({
      title: 'Contraseña Actualizada',
      description: 'Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión.',
    });
    
    router.push('/');
  };

  if (!token) {
    return (
       <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <TarjetaAutenticacion
            title="Token Inválido"
            description="El enlace para restablecer la contraseña no es válido o ha expirado."
            footer={
            <div className="text-center text-sm">
                <Link href="/recuperar-contrasena" className="font-medium text-primary hover:underline">
                    Solicitar un nuevo enlace
                </Link>
            </div>
            }
        >
            <div/>
        </TarjetaAutenticacion>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <TarjetaAutenticacion
        title="Establecer Nueva Contraseña"
        description="Ingresa y confirma tu nueva contraseña."
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
            <Label htmlFor="password">Nueva Contraseña</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Contraseña
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}

export default function PaginaNuevaContrasena() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <NuevaContrasenaComponent />
        </Suspense>
    )
}
