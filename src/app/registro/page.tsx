'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TarjetaAutenticacion } from '@/components/tarjeta-autenticacion';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usarNotificacion } from '@/hooks/usar-notificacion';
import { Loader2 } from 'lucide-react';

export default function PaginaRegistro() {
  const router = useRouter();
  const { notificacion } = usarNotificacion();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
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

    if (password.length < 6) {
        notificacion({
            title: 'Error de Registro',
            description: 'La contraseña debe tener al menos 6 caracteres.',
            variant: 'destructive',
        });
        setCargando(false);
        return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Opcional: podrías guardar el 'nombre' en el perfil del usuario de Firebase.
      router.push('/panel');
    } catch (error: any) {
      console.error("Error de registro:", error);
      let mensajeError = 'Ocurrió un error durante el registro.';
      if (error.code === 'auth/email-already-in-use') {
        mensajeError = 'Este correo electrónico ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        mensajeError = 'El formato del correo electrónico no es válido.';
      }
      notificacion({
        title: 'Error de Registro',
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
            <Input id="name" type="text" placeholder="Tu Nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={cargando} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={cargando} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={cargando} />
          </div>
          <Button type="submit" className="w-full" disabled={cargando}>
            {cargando ? <Loader2 className="animate-spin" /> : 'Crear Cuenta'}
          </Button>
        </form>
      </TarjetaAutenticacion>
    </main>
  );
}
