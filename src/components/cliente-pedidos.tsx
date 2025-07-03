
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { PlusCircle, Trash2, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { type PedidoReposicion, type Producto, type Proveedor, EstadoPedido } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClientePedidosProps {
  pedidosIniciales: PedidoReposicion[];
  productosInventario: Producto[];
  proveedoresInventario: Proveedor[];
}

export function ClientePedidos({ pedidosIniciales, productosInventario, proveedoresInventario }: ClientePedidosProps) {
  const [pedidos, setPedidos] = useState<PedidoReposicion[]>(pedidosIniciales);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [pedidoParaConfirmar, setPedidoParaConfirmar] = useState<{ id: string, estado: EstadoPedido } | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const { notificacion } = usarNotificacion();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const productoId = searchParams.get('productoId');
    if (productoId) {
      setFormularioAbierto(true);
    }
  }, [searchParams]);

  const handleCrearPedido = async (pedidoData: Omit<PedidoReposicion, 'id' | 'estado' | 'fechaPedido'>) => {
    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el pedido');
      }

      const nuevoPedido = await response.json();
      setPedidos(prev => [nuevoPedido, ...prev]);
      setFormularioAbierto(false);
      notificacion({
        title: 'Éxito',
        description: 'Pedido de reposición creado correctamente.',
      });
    } catch (error: any) {
      notificacion({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleActualizarEstado = async () => {
    if (!pedidoParaConfirmar) return;

    const { id, estado } = pedidoParaConfirmar;

    try {
        const response = await fetch(`/api/pedidos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const pedidoActualizado = await response.json();
        setPedidos(pedidos.map(p => p.id === id ? pedidoActualizado : p));
        notificacion({
            title: 'Éxito',
            description: `El pedido ha sido marcado como "${estado}".` + (estado === EstadoPedido.COMPLETADO ? ' El stock ha sido actualizado.' : ''),
        });

    } catch (error: any) {
        notificacion({
            title: 'Error',
            description: error.message || 'No se pudo actualizar el estado del pedido.',
            variant: 'destructive',
        });
    } finally {
        setPedidoParaConfirmar(null);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pedidos de Reposición</CardTitle>
              <CardDescription>
                Gestiona los pedidos a tus proveedores.
              </CardDescription>
            </div>
            <Button onClick={() => setFormularioAbierto(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Pedido
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pedido</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead><span className="sr-only">Acciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.length > 0 ? (
                  pedidos.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-mono text-xs">{pedido.id}</TableCell>
                      <TableCell className="font-medium">{pedido.proveedorNombre}</TableCell>
                      <TableCell>{isClient ? format(new Date(pedido.fechaPedido), 'dd/MM/yyyy') : ''}</TableCell>
                      <TableCell>{pedido.productos.length}</TableCell>
                      <TableCell>
                        <Badge variant={
                            pedido.estado === EstadoPedido.PENDIENTE ? 'secondary' : 
                            pedido.estado === EstadoPedido.COMPLETADO ? 'default' : 'destructive'
                        }>
                          {pedido.estado}
                        </Badge>
                      </TableCell>
                       <TableCell className="text-right">
                         {pedido.estado === EstadoPedido.PENDIENTE && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onSelect={() => setPedidoParaConfirmar({id: pedido.id, estado: EstadoPedido.COMPLETADO})}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Marcar como Completado
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setPedidoParaConfirmar({id: pedido.id, estado: EstadoPedido.CANCELADO})} className="text-destructive">
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancelar Pedido
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                         )}
                       </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No hay pedidos registrados.
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
          <FormularioPedido
            productosInventario={productosInventario}
            proveedoresInventario={proveedoresInventario}
            onGuardar={handleCrearPedido}
            onCerrar={() => setFormularioAbierto(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!pedidoParaConfirmar} onOpenChange={(open) => !open && setPedidoParaConfirmar(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    {pedidoParaConfirmar?.estado === EstadoPedido.COMPLETADO 
                        ? "Esto marcará el pedido como completado y añadirá las cantidades de los productos a tu inventario. Esta acción no se puede deshacer."
                        : "Esto cancelará el pedido. Esta acción no se puede deshacer."
                    }
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setPedidoParaConfirmar(null)}>No, volver</AlertDialogCancel>
                <AlertDialogAction onClick={handleActualizarEstado}>
                    Sí, continuar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// --- Componente de Formulario Interno ---

interface FormularioPedidoProps {
  productosInventario: Producto[];
  proveedoresInventario: Proveedor[];
  onGuardar: (data: any) => Promise<void>;
  onCerrar: () => void;
}

function FormularioPedido({ productosInventario, proveedoresInventario, onGuardar, onCerrar }: FormularioPedidoProps) {
  const searchParams = useSearchParams();
  const initialProductoId = searchParams.get('productoId');
  const initialProveedorId = searchParams.get('proveedorId');
  
  const [proveedorId, setProveedorId] = useState('');
  const [productos, setProductos] = useState([{ productoId: '', cantidadPedida: 1 }]);

  useEffect(() => {
    if (initialProveedorId) {
        setProveedorId(initialProveedorId);
    }
    if (initialProductoId) {
        setProductos([{ productoId: initialProductoId, cantidadPedida: 10 }]); // Default 10
    }
  }, [initialProductoId, initialProveedorId]);


  const productosFiltradosPorProveedor = React.useMemo(() => {
    if (!proveedorId) return productosInventario;
    return productosInventario.filter(p => p.proveedorId === proveedorId);
  }, [proveedorId, productosInventario]);

  const agregarProducto = () => {
    setProductos([...productos, { productoId: '', cantidadPedida: 1 }]);
  };

  const eliminarProducto = (index: number) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
  };

  const actualizarProducto = (index: number, campo: 'productoId' | 'cantidadPedida', valor: string | number) => {
    const nuevosProductos = [...productos];
    const prod = nuevosProductos[index];
    if(campo === 'productoId') prod.productoId = valor as string;
    if(campo === 'cantidadPedida') prod.cantidadPedida = Number(valor) > 0 ? Number(valor) : 1;
    setProductos(nuevosProductos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proveedorId || productos.some(m => !m.productoId)) {
      alert("Por favor, selecciona un proveedor y completa todos los productos.");
      return;
    }
    
    const datosPedido = {
      proveedorId,
      productos: productos.map(p => ({
          productoId: p.productoId,
          cantidadPedida: p.cantidadPedida,
      })),
    };
    
    await onGuardar(datosPedido);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Crear Pedido de Reposición</DialogTitle>
        <DialogDescription>
          Selecciona un proveedor y los productos que deseas pedir.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
        <div className="space-y-2">
          <label htmlFor="proveedor">Proveedor</label>
          <select 
            id="proveedor" 
            value={proveedorId} 
            onChange={(e) => setProveedorId(e.target.value)} 
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="" disabled>Selecciona un proveedor...</option>
            {proveedoresInventario.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-4">
          <label className="font-medium">Productos a Pedir</label>
          {productos.map((prod, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
              <select 
                value={prod.productoId} 
                onChange={(e) => actualizarProducto(index, 'productoId', e.target.value)} 
                className="flex-grow flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>Selecciona un producto...</option>
                {productosFiltradosPorProveedor.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.cantidad})</option>
                ))}
              </select>
              <Input
                type="number"
                min="1"
                value={prod.cantidadPedida}
                onChange={(e) => actualizarProducto(index, 'cantidadPedida', e.target.value)}
                className="w-24"
                required
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => eliminarProducto(index)} disabled={productos.length === 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={agregarProducto} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
          </Button>
        </div>
      </div>
      
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="secondary" onClick={onCerrar}>Cancelar</Button>
        </DialogClose>
        <Button type="submit">Guardar Pedido</Button>
      </DialogFooter>
    </form>
  );
}
