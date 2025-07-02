'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { TarjetaAutenticacion } from '@/componentes/tarjeta-autenticacion';

export default function PaginaRegistro() {
  const router = useRouter();

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/panel');
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
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input id="name" type="text" placeholder="Tu Nombre" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Crear Cuenta
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}
