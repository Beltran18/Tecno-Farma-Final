'use client';

import React, { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { type DevolucionProveedor, type Producto } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClienteDevolucionesProps {
  devolucionesIniciales: DevolucionProveedor[];
  productosInventario: Producto[];
}

export function ClienteDevoluciones({ devolucionesIniciales, productosInventario }: ClienteDevolucionesProps) {
  const [devoluciones, setDevoluciones] = useState<DevolucionProveedor[]>(devolucionesIniciales);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [devolucionParaEliminar, setDevolucionParaEliminar] = useState<string | null>(null);
  const { notificacion } = usarNotificacion();

  const handleCrearDevolucion = async (devolucionData: { productoId: string; cantidadDevuelta: number; motivo: string; }) => {
    try {
      const response = await fetch('/api/devoluciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(devolucionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar la devolución');
      }

      const nuevaDevolucion = await response.json();
      setDevoluciones(prev => [nuevaDevolucion, ...prev]);
      setFormularioAbierto(false);
      notificacion({
        title: 'Éxito',
        description: 'Devolución registrada correctamente. El stock ha sido actualizado.',
      });
    } catch (error: any) {
      notificacion({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleEliminarDevolucion = async () => {
    if (!devolucionParaEliminar) return;

    try {
      const response = await fetch(`/api/devoluciones/${devolucionParaEliminar}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar la devolución');
      }

      setDevoluciones(prev => prev.filter(d => d.id !== devolucionParaEliminar));
      notificacion({
        title: 'Éxito',
        description: 'Devolución eliminada correctamente.',
      });
    } catch (error: any) {
      notificacion({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
        setDevolucionParaEliminar(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Devoluciones a Proveedores</CardTitle>
              <CardDescription>
                Registra y consulta las devoluciones de productos.
              </CardDescription>
            </div>
            <Button onClick={() => setFormularioAbierto(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Devolución
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead><span className="sr-only">Acciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devoluciones.length > 0 ? (
                  devoluciones.map((devolucion) => (
                    <TableRow key={devolucion.id}>
                      <TableCell>{format(new Date(devolucion.fecha), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="font-medium">{devolucion.productoNombre}</TableCell>
                      <TableCell>{devolucion.proveedorNombre}</TableCell>
                      <TableCell className="text-right">{devolucion.cantidadDevuelta}</TableCell>
                      <TableCell className="text-sm text-muted-foreground truncate" style={{maxWidth: '300px'}}>{devolucion.motivo}</TableCell>
                       <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onSelect={() => setDevolucionParaEliminar(devolucion.id)} className="text-destructive">
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
                    <TableCell colSpan={6} className="text-center h-24">
                      No hay devoluciones registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={formularioAbierto} onOpenChange={setFormularioAbierto}>
        <DialogContent className="sm:max-w-lg">
          <FormularioDevolucion
            productosInventario={productosInventario.filter(p => p.proveedorId)}
            onGuardar={handleCrearDevolucion}
            onCerrar={() => setFormularioAbierto(false)}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!devolucionParaEliminar} onOpenChange={(open) => !open && setDevolucionParaEliminar(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción eliminará permanentemente el registro de esta devolución. No afectará el stock del producto. Esta acción no se puede deshacer.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleEliminarDevolucion}>
                    Sí, eliminar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


interface FormularioDevolucionProps {
  productosInventario: Producto[];
  onGuardar: (data: any) => Promise<void>;
  onCerrar: () => void;
}

function FormularioDevolucion({ productosInventario, onGuardar, onCerrar }: FormularioDevolucionProps) {
  const [productoId, setProductoId] = useState('');
  const [cantidadDevuelta, setCantidadDevuelta] = useState(1);
  const [motivo, setMotivo] = useState('');

  const productoSeleccionado = productosInventario.find(p => p.id === productoId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoId || !cantidadDevuelta || !motivo) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    
    await onGuardar({ productoId, cantidadDevuelta, motivo });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Registrar Devolución a Proveedor</DialogTitle>
        <DialogDescription>
          Selecciona un producto y especifica el motivo de la devolución.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
        <div className="space-y-2">
          <label htmlFor="producto">Producto a devolver</label>
          <select 
            id="producto" 
            value={productoId} 
            onChange={(e) => {
                setProductoId(e.target.value);
                setCantidadDevuelta(1);
            }}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="" disabled>Selecciona un producto...</option>
            {productosInventario.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} (Proveedor: {p.proveedorNombre})</option>
            ))}
          </select>
        </div>

        {productoSeleccionado && (
            <div className="space-y-2">
                <label htmlFor="cantidad">Cantidad a devolver (Stock actual: {productoSeleccionado.cantidad})</label>
                <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    max={productoSeleccionado.cantidad}
                    value={cantidadDevuelta}
                    onChange={(e) => setCantidadDevuelta(Number(e.target.value))}
                    required
                />
            </div>
        )}
        
        <div className="space-y-2">
            <label htmlFor="motivo">Motivo de la devolución</label>
            <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: Producto defectuoso, empaque dañado, etc."
                required
            />
        </div>
      </div>
      
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="secondary" onClick={onCerrar}>Cancelar</Button>
        </DialogClose>
        <Button type="submit">Registrar Devolución</Button>
      </DialogFooter>
    </form>
  );
}
