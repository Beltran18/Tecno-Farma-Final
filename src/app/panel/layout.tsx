'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { Home, User, LogOut, Settings, Tag, Truck, CalendarDays, LifeBuoy, FileText, BookOpenCheck, NotebookPen, ClipboardList, Undo2, Boxes, BarChart3, PackageSearch, UsersRound, Bell } from 'lucide-react';
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

  const [notifications, setNotifications] = useState([
    { id: 1, title: '¡Roles y Permisos!', description: 'La barra lateral ahora se adapta según el rol del usuario.', read: false, date: 'hace 1 día' },
    { id: 2, title: 'Calendario Mejorado', description: 'Ahora puedes visualizar las entregas de pedidos pendientes.', read: false, date: 'hace 2 días' },
    { id: 3, title: 'Gestión de Empleados', description: 'Añade, edita y gestiona las cuentas de tu equipo.', read: false, date: 'hace 3 días' },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

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
          <h1 className="text-xl font-semibold flex-grow">{getTitle()}</h1>

          <Popover onOpenChange={(open) => { if (!open) setTimeout(() => setNotifications(notifications.map(n => ({...n, read: true}))), 500)}}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 mr-4">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <h4 className="font-medium leading-none">Notificaciones</h4>
                  <p className="text-sm text-muted-foreground">
                    Últimas actualizaciones del sistema.
                  </p>
                </div>
                <div className="grid gap-2">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className={`flex h-2 w-2 translate-y-1 rounded-full ${!notification.read ? 'bg-primary' : 'bg-muted'}`} />
                      <div className="grid gap-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
