'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Trash2, PlusCircle, Edit } from 'lucide-react';
import { type Empleado, RolEmpleado } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClienteEmpleadosProps {
  empleadosIniciales: Empleado[];
}

export function ClienteEmpleados({ empleadosIniciales }: ClienteEmpleadosProps) {
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosIniciales);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [empleadoEnEdicion, setEmpleadoEnEdicion] = useState<Empleado | null>(null);
  const [empleadoParaEliminar, setEmpleadoParaEliminar] = useState<Empleado | null>(null);
  const { notificacion } = usarNotificacion();

  const handleGuardarEmpleado = async (empleadoData: Omit<Empleado, 'id'> | Empleado) => {
    const esEdicion = 'id' in empleadoData;
    const url = esEdicion ? `/api/empleados/${empleadoData.id}` : '/api/empleados';
    const method = esEdicion ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error al ${esEdicion ? 'actualizar' : 'crear'} el empleado`);
      }
      const empleadoGuardado = await response.json();
      if (esEdicion) {
        setEmpleados(empleados.map(e => e.id === empleadoGuardado.id ? empleadoGuardado : e));
      } else {
        setEmpleados([...empleados, empleadoGuardado]);
      }
      setFormularioAbierto(false);
      notificacion({
        title: 'Éxito',
        description: `Empleado ${esEdicion ? 'actualizado' : 'agregado'} correctamente.`,
      });
    } catch (error: any) {
      notificacion({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEliminarEmpleado = async () => {
    if (!empleadoParaEliminar) return;

    try {
        const response = await fetch(`/api/empleados/${empleadoParaEliminar.id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo eliminar el empleado');
        }
        setEmpleados(empleados.filter(e => e.id !== empleadoParaEliminar.id));
        notificacion({
            title: 'Éxito',
            description: 'Empleado eliminado correctamente.',
        });
    } catch (error: any) {
        notificacion({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setEmpleadoParaEliminar(null);
    }
  };

  const abrirFormularioEditar = (empleado: Empleado) => {
    setEmpleadoEnEdicion(empleado);
    setFormularioAbierto(true);
  }

  const abrirFormularioNuevo = () => {
    setEmpleadoEnEdicion(null);
    setFormularioAbierto(true);
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestionar Empleados</CardTitle>
            <CardDescription>
              Agrega, edita o elimina las cuentas de los empleados.
            </CardDescription>
          </div>
          <Button onClick={abrirFormularioNuevo}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Empleado
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo Electrónico</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleados.length > 0 ? (
                empleados.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell className="font-medium">{empleado.nombre}</TableCell>
                    <TableCell>{empleado.email}</TableCell>
                    <TableCell>
                      <Badge variant={empleado.rol === RolEmpleado.ADMINISTRADOR ? 'default' : 'secondary'}>
                        {empleado.rol}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={empleado.id === 'emp_admin'}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => abrirFormularioEditar(empleado)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setEmpleadoParaEliminar(empleado)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No hay empleados registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Dialog open={formularioAbierto} onOpenChange={setFormularioAbierto}>
        <DialogContent className="sm:max-w-[425px]">
          <FormularioEmpleado
            empleado={empleadoEnEdicion}
            onGuardar={handleGuardarEmpleado}
          />
        </DialogContent>
      </Dialog>
    
      <AlertDialog open={!!empleadoParaEliminar} onOpenChange={(open) => !open && setEmpleadoParaEliminar(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este empleado?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de "{empleadoParaEliminar?.nombre}".
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminarEmpleado}>
                Sí, eliminar
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


function FormularioEmpleado({ empleado, onGuardar }: { empleado: Empleado | null, onGuardar: (p: any) => Promise<void>}) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<RolEmpleado>(RolEmpleado.EMPLEADO);

  useEffect(() => {
    if (empleado) {
      setNombre(empleado.nombre);
      setEmail(empleado.email);
      setRol(empleado.rol);
    } else {
      setNombre('');
      setEmail('');
      setRol(RolEmpleado.EMPLEADO);
    }
  }, [empleado]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const datosEmpleado = { nombre, email, rol };

    if (empleado) {
      await onGuardar({ ...datosEmpleado, id: empleado.id });
    } else {
      await onGuardar(datosEmpleado);
    }
  };

  return (
    <form onSubmit={handleEnviar}>
      <DialogHeader>
        <DialogTitle>{empleado ? 'Editar Empleado' : 'Agregar Empleado'}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
            <label htmlFor="nombre">Nombre Completo</label>
            <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div className="space-y-2">
            <label htmlFor="email">Correo Electrónico</label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
            <label htmlFor="rol">Rol</label>
             <Select onValueChange={(value: RolEmpleado) => setRol(value)} value={rol}>
                <SelectTrigger id="rol">
                    <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={RolEmpleado.ADMINISTRADOR}>Administrador</SelectItem>
                    <SelectItem value={RolEmpleado.EMPLEADO}>Empleado</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  );
}
