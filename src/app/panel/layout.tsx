'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, User, LogOut, Settings, Tag, Truck, CalendarDays, LifeBuoy, FileText, BookOpenCheck, Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { usarNotificacion } from '@/hooks/usar-notificacion';

export default function DisposicionPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { notificacion } = usarNotificacion();
  const [usuario, setUsuario] = useState<FirebaseUser | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Si Firebase está configurado, usamos el sistema de autenticación real.
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUsuario(user);
        } else {
          // Si no hay usuario, lo redirigimos a la página de inicio de sesión.
          router.push('/');
        }
        setCargando(false);
      });

      return () => unsubscribe();
    } else {
      // Si Firebase no está configurado, simulamos un usuario para permitir
      // el acceso al panel en modo de desarrollo y evitamos un crash.
      setUsuario({
        email: 'desarrollo@tecnofarma.com',
        displayName: 'Modo Desarrollo',
        uid: 'dev-user-placeholder'
      } as FirebaseUser);
      setCargando(false);
    }
  }, [router]);

  const handleLogout = async () => {
    if (!auth) {
      notificacion({
        title: 'Modo Desarrollo',
        description: 'La autenticación de Firebase no está configurada. Saliendo al inicio.',
      });
      router.push('/');
      return;
    }
    try {
      await signOut(auth);
      router.push('/');
       notificacion({
        title: 'Sesión Cerrada',
        description: 'Has cerrado sesión exitosamente.',
      });
    } catch (error) {
       notificacion({
        title: 'Error',
        description: 'No se pudo cerrar la sesión.',
        variant: 'destructive',
      });
    }
  };

  const getTitle = () => {
    if (pathname === '/panel') return 'Panel de Control';
    if (pathname.startsWith('/panel/categorias')) return 'Gestión de Categorías';
    if (pathname.startsWith('/panel/proveedores')) return 'Gestión de Proveedores';
    if (pathname.startsWith('/panel/calendario')) return 'Calendario de Vencimientos';
    if (pathname.startsWith('/panel/reportes')) return 'Generación de Reportes';
    if (pathname.startsWith('/panel/ayuda')) return 'Ayuda y Tutoriales';
    if (pathname.startsWith('/panel/soporte')) return 'Soporte Técnico';
    return 'TecnoFarma';
  };
  
  if (cargando) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  if (!usuario) {
    return null; // O un componente de redirección
  }

  return (
    <SidebarProvider>
      <Sidebar className="no-imprimir">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel" tooltip="Panel" isActive={pathname === '/panel'}>
                <Home />
                Panel Principal
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel/categorias" tooltip="Categorías" isActive={pathname.startsWith('/panel/categorias')}>
                <Tag />
                Categorías
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel/proveedores" tooltip="Proveedores" isActive={pathname.startsWith('/panel/proveedores')}>
                <Truck />
                Proveedores
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel/calendario" tooltip="Calendario" isActive={pathname.startsWith('/panel/calendario')}>
                <CalendarDays />
                Calendario
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/panel/reportes" tooltip="Reportes" isActive={pathname.startsWith('/panel/reportes')}>
                <FileText />
                Reportes
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/panel/ayuda" tooltip="Ayuda" isActive={pathname.startsWith('/panel/ayuda')}>
                <BookOpenCheck />
                Ayuda y Tutoriales
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel/soporte" tooltip="Soporte" isActive={pathname.startsWith('/panel/soporte')}>
                <LifeBuoy />
                Soporte
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto w-full justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={usuario.photoURL || `https://placehold.co/100x100.png`} alt={usuario.displayName || 'Usuario'} />
                  <AvatarFallback>{usuario.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-left w-full overflow-hidden">
                  <p className="text-sm font-medium truncate">{usuario.displayName || 'Usuario'}</p>
                  <p className="text-xs text-muted-foreground truncate">{usuario.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Ajustes</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm no-imprimir">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold">{getTitle()}</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
