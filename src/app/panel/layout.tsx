'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
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
import { Home, User, LogOut, Settings, Tag, Truck, CalendarDays, LifeBuoy, FileText, BookOpenCheck, NotebookPen, ClipboardList, Undo2, Boxes, BarChart3, PackageSearch, UsersRound } from 'lucide-react';
import { Logo } from '@/components/logo';
import { usarNotificacion } from '@/hooks/usar-notificacion';
import { RolEmpleado } from '@/lib/types';
import { Badge } from '@/components/ui/badge';


export default function DisposicionPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { notificacion } = usarNotificacion();

  const handleLogout = () => {
    notificacion({
      title: 'Sesión Cerrada',
      description: 'Has cerrado la sesión simulada.',
    });
    router.push('/');
  };

  const getTitle = () => {
    if (pathname === '/panel') return 'Panel de Control';
    if (pathname.startsWith('/panel/categorias')) return 'Gestión de Categorías';
    if (pathname.startsWith('/panel/proveedores')) return 'Gestión de Proveedores';
    if (pathname.startsWith('/panel/empleados')) return 'Gestión de Empleados';
    if (pathname.startsWith('/panel/calendario')) return 'Calendario de Vencimientos';
    if (pathname.startsWith('/panel/reportes')) return 'Generación de Reportes';
    if (pathname.startsWith('/panel/ayuda')) return 'Ayuda y Tutoriales';
    if (pathname.startsWith('/panel/soporte')) return 'Soporte Técnico';
    if (pathname.startsWith('/panel/recetas')) return 'Gestión de Recetas';
    if (pathname.startsWith('/panel/pedidos')) return 'Gestión de Pedidos';
    if (pathname.startsWith('/panel/devoluciones')) return 'Devoluciones a Proveedores';
    if (pathname.startsWith('/panel/kits')) return 'Kits y Paquetes';
    if (pathname.startsWith('/panel/analisis')) return 'Análisis de Rentabilidad';
    if (pathname.startsWith('/panel/trazabilidad')) return 'Trazabilidad de Lotes';
    return 'TecnoFarma';
  };
  
  // Datos de usuario simulados para desarrollo
  const usuarioSimulado = {
    email: 'admin@tecnofarma.com',
    displayName: 'Administrador de Prueba',
    photoURL: null,
    rol: RolEmpleado.ADMINISTRADOR, // Cambia a RolEmpleado.EMPLEADO para probar la vista restringida
  };

  const esAdmin = usuarioSimulado.rol === RolEmpleado.ADMINISTRADOR;

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
              <SidebarMenuButton href="/panel/productos" tooltip="Productos" isActive={pathname.startsWith('/panel/productos')}>
                <Tag />
                Productos
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel/recetas" tooltip="Recetas" isActive={pathname.startsWith('/panel/recetas')}>
                <NotebookPen />
                Recetas
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel/pedidos" tooltip="Pedidos" isActive={pathname.startsWith('/panel/pedidos')}>
                <ClipboardList />
                Pedidos
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel/devoluciones" tooltip="Devoluciones" isActive={pathname.startsWith('/panel/devoluciones')}>
                <Undo2 />
                Devoluciones
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel/kits" tooltip="Kits" isActive={pathname.startsWith('/panel/kits')}>
                <Boxes />
                Kits y Paquetes
              </SidebarMenuButton>
            </SidebarMenuItem>
             {esAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton href="/panel/analisis" tooltip="Análisis" isActive={pathname.startsWith('/panel/analisis')}>
                  <BarChart3 />
                  Análisis
                </SidebarMenuButton>
              </SidebarMenuItem>
             )}
             <SidebarMenuItem>
              <SidebarMenuButton href="/panel/trazabilidad" tooltip="Trazabilidad" isActive={pathname.startsWith('/panel/trazabilidad')}>
                <PackageSearch />
                Trazabilidad
              </SidebarMenuButton>
            </SidebarMenuItem>
            {esAdmin && (
              <>
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
                  <SidebarMenuButton href="/panel/empleados" tooltip="Empleados" isActive={pathname.startsWith('/panel/empleados')}>
                    <UsersRound />
                    Empleados
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton href="/panel/calendario" tooltip="Calendario" isActive={pathname.startsWith('/panel/calendario')}>
                <CalendarDays />
                Calendario
              </SidebarMenuButton>
            </SidebarMenuItem>
             {esAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton href="/panel/reportes" tooltip="Reportes" isActive={pathname.startsWith('/panel/reportes')}>
                  <FileText />
                  Reportes
                </SidebarMenuButton>
              </SidebarMenuItem>
             )}
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
              <Button variant="ghost" className="h-auto w-full justify-start gap-2 p-2" suppressHydrationWarning>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={usuarioSimulado.photoURL || `https://placehold.co/100x100.png`} alt={usuarioSimulado.displayName || 'Usuario'} />
                  <AvatarFallback>{usuarioSimulado.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-left w-full overflow-hidden" suppressHydrationWarning>
                  <p className="text-sm font-medium truncate">{usuarioSimulado.displayName || 'Usuario'}</p>
                   <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground truncate">{usuarioSimulado.email}</p>
                    <Badge variant={esAdmin ? 'default' : 'secondary'} className="h-4 px-1.5 text-[10px]">{usuarioSimulado.rol}</Badge>
                  </div>
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
