'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TarjetaAutenticacion } from '@/components/tarjeta-autenticacion';

export default function PaginaInicioSesion() {
  const router = useRouter();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Simplemente redirige al panel sin autenticación real por ahora.
    router.push('/panel');
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
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="/recuperar-contrasena" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}
