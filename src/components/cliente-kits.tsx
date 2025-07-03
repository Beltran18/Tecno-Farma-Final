'use client';

import React, { useState, useMemo } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, MoreHorizontal, ShoppingCart } from 'lucide-react';
import { type Kit, type Producto } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClienteKitsProps {
  kitsIniciales: Kit[];
  productosInventario: Producto[];
}

export function ClienteKits({ kitsIniciales, productosInventario }: ClienteKitsProps) {
  const [kits, setKits] = useState<Kit[]>(kitsIniciales);
  const [productos, setProductos] = useState<Producto[]>(productosInventario);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [ventaDialogAbierto, setVentaDialogAbierto] = useState(false);
  const [kitSeleccionado, setKitSeleccionado] = useState<Kit | null>(null);
  const [kitParaEliminar, setKitParaEliminar] = useState<Kit | null>(null);
  const { notificacion } = usarNotificacion();

  const stockCalculado = useMemo(() => {
    const stockMap = new Map<string, number>();
    const productStockMap = new Map(productos.map(p => [p.id, p.cantidad]));

    for (const kit of kits) {
      const stockDisponible = Math.min(
        ...kit.componentes.map(c => 
          Math.floor((productStockMap.get(c.productoId) || 0) / c.cantidad)
        )
      );
      stockMap.set(kit.id, stockDisponible);
    }
    return stockMap;
  }, [kits, productos]);

  const handleCrearKit = async (kitData: Omit<Kit, 'id'>) => {
    try {
      const response = await fetch('/api/kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el kit');
      }

      const nuevoKit = await response.json();
      setKits(prev => [nuevoKit, ...prev]);
      setFormularioAbierto(false);
      notificacion({ title: 'Éxito', description: 'Kit creado correctamente.' });
    } catch (error: any) {
      notificacion({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleVenderKit = async (cantidad: number) => {
    if (!kitSeleccionado) return;

    try {
        const response = await fetch(`/api/kits/${kitSeleccionado.id}/vender`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cantidad }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const { message } = await response.json();
        // Recargar productos para actualizar stock
        const updatedProductsRes = await fetch('/api/productos');
        const updatedProducts = await updatedProductsRes.json();
        setProductos(updatedProducts);
        
        setVentaDialogAbierto(false);
        setKitSeleccionado(null);
        notificacion({ title: 'Éxito', description: message });

    } catch (error: any) {
        notificacion({ title: 'Error al vender', description: error.message, variant: 'destructive' });
    }
  };
  
  const handleEliminarKit = async () => {
    if (!kitParaEliminar) return;
    try {
        const response = await fetch(`/api/kits/${kitParaEliminar.id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('No se pudo eliminar el kit');
        }
        setKits(kits.filter(k => k.id !== kitParaEliminar.id));
        notificacion({ title: 'Éxito', description: 'Kit eliminado correctamente.' });
    } catch (error: any) {
        notificacion({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
        setKitParaEliminar(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Kits y Paquetes</CardTitle>
              <CardDescription>
                Crea y gestiona paquetes de productos para vender como una unidad.
              </CardDescription>
            </div>
            <Button onClick={() => setFormularioAbierto(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Kit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Kit</TableHead>
                  <TableHead>Componentes</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Stock Disponible</TableHead>
                  <TableHead><span className="sr-only">Acciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kits.length > 0 ? (
                  kits.map((kit) => (
                    <TableRow key={kit.id}>
                      <TableCell className="font-medium">{kit.nombre}</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {kit.componentes.map(c => <li key={c.productoId}>{c.productoNombre} (x{c.cantidad})</li>)}
                        </ul>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(kit.precio)}
                      </TableCell>
                       <TableCell className="text-right font-medium">{stockCalculado.get(kit.id) || 0}</TableCell>
                       <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => { setKitSeleccionado(kit); setVentaDialogAbierto(true); }}>
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Vender Kit
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setKitParaEliminar(kit)} className="text-destructive">
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
                    <TableCell colSpan={5} className="text-center h-24">
                      No hay kits creados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={formularioAbierto} onOpenChange={setFormularioAbierto}>
        <DialogContent className="sm:max-w-2xl">
          <FormularioKit
            productosInventario={productosInventario}
            onGuardar={handleCrearKit}
            onCerrar={() => setFormularioAbierto(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={ventaDialogAbierto} onOpenChange={setVentaDialogAbierto}>
        <DialogContent className="sm:max-w-md">
            <FormularioVentaKit
                kit={kitSeleccionado}
                maxStock={stockCalculado.get(kitSeleccionado?.id || '') || 0}
                onGuardar={handleVenderKit}
                onCerrar={() => setVentaDialogAbierto(false)}
            />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!kitParaEliminar} onOpenChange={(open) => !open && setKitParaEliminar(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro de eliminar este kit?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción es permanente y no se puede deshacer. Se eliminará la definición del kit "{kitParaEliminar?.nombre}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setKitParaEliminar(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleEliminarKit}>Sí, eliminar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function FormularioKit({ productosInventario, onGuardar, onCerrar }: { productosInventario: Producto[], onGuardar: (data: any) => Promise<void>, onCerrar: () => void}) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState(0);
  const [componentes, setComponentes] = useState([{ productoId: '', cantidad: 1 }]);

  const agregarComponente = () => {
    setComponentes([...componentes, { productoId: '', cantidad: 1 }]);
  };

  const eliminarComponente = (index: number) => {
    const nuevosComponentes = componentes.filter((_, i) => i !== index);
    setComponentes(nuevosComponentes);
  };

  const actualizarComponente = (index: number, campo: 'productoId' | 'cantidad', valor: string | number) => {
    const nuevosComponentes = [...componentes];
    const comp = nuevosComponentes[index];
    if(campo === 'productoId') comp.productoId = valor as string;
    if(campo === 'cantidad') comp.cantidad = Number(valor) > 0 ? Number(valor) : 1;
    setComponentes(nuevosComponentes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !precio || componentes.some(c => !c.productoId)) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    await onGuardar({ nombre, precio, componentes });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Crear Nuevo Kit</DialogTitle>
        <DialogDescription>Define los productos que compondrán este paquete.</DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="nombre">Nombre del Kit</label>
                <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Ej: Kit Antigripal" />
            </div>
            <div className="space-y-2">
                <label htmlFor="precio">Precio de Venta del Kit</label>
                <Input id="precio" type="number" value={precio} onChange={e => setPrecio(Number(e.target.value))} required min="0" />
            </div>
        </div>
        
        <div className="space-y-4">
          <label className="font-medium">Componentes del Kit</label>
          {componentes.map((comp, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
              <select 
                value={comp.productoId} 
                onChange={(e) => actualizarComponente(index, 'productoId', e.target.value)} 
                className="flex-grow flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>Selecciona un producto...</option>
                {productosInventario.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.cantidad})</option>
                ))}
              </select>
              <Input
                type="number"
                min="1"
                value={comp.cantidad}
                onChange={(e) => actualizarComponente(index, 'cantidad', e.target.value)}
                className="w-24"
                placeholder="Cant."
                required
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => eliminarComponente(index)} disabled={componentes.length === 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={agregarComponente} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Componente
          </Button>
        </div>
      </div>
      
      <DialogFooter className="pt-4 border-t">
        <DialogClose asChild><Button type="button" variant="secondary" onClick={onCerrar}>Cancelar</Button></DialogClose>
        <Button type="submit">Guardar Kit</Button>
      </DialogFooter>
    </form>
  );
}

function FormularioVentaKit({ kit, maxStock, onGuardar, onCerrar }: { kit: Kit | null, maxStock: number, onGuardar: (cantidad: number) => Promise<void>, onCerrar: () => void }) {
  const [cantidad, setCantidad] = useState(1);

  if (!kit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cantidad > 0) {
      onGuardar(cantidad);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Vender Kit: {kit.nombre}</DialogTitle>
        <DialogDescription>
          Stock disponible para armar: <strong>{maxStock}</strong>. Ingresa la cantidad de kits a vender.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <label htmlFor="cantidad-venta">Cantidad</label>
        <Input
          id="cantidad-venta"
          type="number"
          min="1"
          max={maxStock}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required
        />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="secondary" onClick={onCerrar}>Cancelar</Button></DialogClose>
        <Button type="submit" disabled={cantidad <= 0 || cantidad > maxStock}>Confirmar Venta</Button>
      </DialogFooter>
    </form>
  );
}
