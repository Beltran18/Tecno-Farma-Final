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
  AlertDialogTrigger,
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
import { MoreHorizontal, Trash2, PlusCircle, Edit } from 'lucide-react';
import { type Proveedor } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClienteProveedoresProps {
  proveedoresIniciales: Proveedor[];
}

export function ClienteProveedores({ proveedoresIniciales }: ClienteProveedoresProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresIniciales);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [proveedorEnEdicion, setProveedorEnEdicion] = useState<Proveedor | null>(null);
  const { notificacion } = usarNotificacion();

  const handleAgregarProveedor = async (proveedor: Omit<Proveedor, 'id'>) => {
    try {
      const response = await fetch('/api/proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el proveedor');
      }
      const proveedorAgregado = await response.json();
      setProveedores([...proveedores, proveedorAgregado]);
      setFormularioAbierto(false);
      notificacion({
        title: 'Éxito',
        description: 'Proveedor agregado correctamente.',
      });
    } catch (error: any) {
      notificacion({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleActualizarProveedor = async (proveedorActualizado: Proveedor) => {
    try {
        const response = await fetch(`/api/proveedores/${proveedorActualizado.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(proveedorActualizado),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo actualizar el proveedor');
        }

        const proveedorDevuelto = await response.json();
        setProveedores(proveedores.map(p => p.id === proveedorDevuelto.id ? proveedorDevuelto : p));
        setProveedorEnEdicion(null);
        setFormularioAbierto(false);
        notificacion({
            title: 'Éxito',
            description: 'Proveedor actualizado correctamente.',
        });
    } catch (error: any) {
        notificacion({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        });
    }
  };

  const handleEliminarProveedor = async (id: string) => {
    try {
        const response = await fetch(`/api/proveedores/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo eliminar el proveedor');
        }
        setProveedores(proveedores.filter(p => p.id !== id));
        notificacion({
            title: 'Éxito',
            description: 'Proveedor eliminado correctamente.',
        });
    } catch (error: any) {
        notificacion({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        });
    }
  };

  const abrirFormularioEditar = (proveedor: Proveedor) => {
    setProveedorEnEdicion(proveedor);
    setFormularioAbierto(true);
  }

  const abrirFormularioNuevo = () => {
    setProveedorEnEdicion(null);
    setFormularioAbierto(true);
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestionar Proveedores</CardTitle>
            <CardDescription>
              Agrega, edita o elimina los proveedores de tu farmacia.
            </CardDescription>
          </div>
          <Button onClick={abrirFormularioNuevo}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Proveedor
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proveedores.length > 0 ? (
                proveedores.map((proveedor) => (
                  <TableRow key={proveedor.id}>
                    <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                    <TableCell>{proveedor.contacto}</TableCell>
                    <TableCell>{proveedor.telefono}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => abrirFormularioEditar(proveedor)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente al proveedor.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleEliminarProveedor(proveedor.id)}>
                                    Continuar
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No hay proveedores registrados.
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
          <FormularioProveedor
            proveedor={proveedorEnEdicion}
            onGuardar={proveedorEnEdicion ? handleActualizarProveedor : handleAgregarProveedor}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}


function FormularioProveedor({ proveedor, onGuardar }: { proveedor: Proveedor | null, onGuardar: (p: any) => Promise<void>}) {
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if (proveedor) {
      setNombre(proveedor.nombre);
      setContacto(proveedor.contacto);
      setTelefono(proveedor.telefono);
    } else {
      setNombre('');
      setContacto('');
      setTelefono('');
    }
  }, [proveedor]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const datosProveedor = { nombre, contacto, telefono };

    if (proveedor) {
      await onGuardar({ ...datosProveedor, id: proveedor.id });
    } else {
      await onGuardar(datosProveedor);
    }
  };

  return (
    <form onSubmit={handleEnviar}>
      <DialogHeader>
        <DialogTitle>{proveedor ? 'Editar Proveedor' : 'Agregar Proveedor'}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
            <label htmlFor="nombre">Nombre del Proveedor</label>
            <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div className="space-y-2">
            <label htmlFor="contacto">Nombre de Contacto</label>
            <Input id="contacto" value={contacto} onChange={e => setContacto(e.target.value)} required />
        </div>
        <div className="space-y-2">
            <label htmlFor="telefono">Teléfono</label>
            <Input id="telefono" value={telefono} onChange={e => setTelefono(e.target.value)} required />
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
