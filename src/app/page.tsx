'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TarjetaAutenticacion } from '@/components/tarjeta-autenticacion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usarNotificacion } from '@/hooks/usar-notificacion';
import { Loader2 } from 'lucide-react';

export default function PaginaInicioSesion() {
  const router = useRouter();
  const { notificacion } = usarNotificacion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCargando(true);

    if (!auth) {
      notificacion({
        title: 'Configuración Requerida',
        description: 'La autenticación de Firebase no está configurada en el archivo .env.',
        variant: 'destructive',
      });
      setCargando(false);
      // En modo desarrollo, redirigir al panel para facilitar el acceso.
      if (process.env.NODE_ENV === 'development') {
        router.push('/panel');
      }
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/panel');
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error);
      let mensajeError = 'Ocurrió un error al iniciar sesión.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        mensajeError = 'Correo o contraseña incorrectos.';
      }
      notificacion({
        title: 'Error de Autenticación',
        description: mensajeError,
        variant: 'destructive',
      });
    } finally {
      setCargando(false);
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
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={cargando} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="/recuperar-contrasena" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={cargando} />
          </div>
          <Button type="submit" className="w-full" disabled={cargando}>
            {cargando ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}
