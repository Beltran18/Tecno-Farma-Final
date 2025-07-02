'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
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
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, DollarSign, Package, AlertTriangle, PlusCircle, Search, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, isWithinInterval, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

import { type Producto, type Categoria, type Proveedor } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClientePanelProps {
  productosIniciales: Producto[];
}

const UMBRAL_STOCK_BAJO = 10;
const UMBRAL_DIAS_VENCIMIENTO = 30;

export function ClientePanel({ productosIniciales }: ClientePanelProps) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const { notificacion } = usarNotificacion();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [catResponse, provResponse] = await Promise.all([
                fetch('/api/categorias'),
                fetch('/api/proveedores')
            ]);

            if (!catResponse.ok) throw new Error('No se pudieron cargar las categorías');
            if (!provResponse.ok) throw new Error('No se pudieron cargar los proveedores');
            
            const catData = await catResponse.json();
            const provData = await provResponse.json();
            
            setCategorias(catData);
            setProveedores(provData);
        } catch (error: any) {
            console.error(error);
            notificacion({
                title: 'Error de carga',
                description: 'No se pudieron cargar los datos necesarios (categorías/proveedores).',
                variant: 'destructive',
            });
        }
    };

    fetchData();
  }, [notificacion]);

  const { totalValorInventario, totalUnidades } = useMemo(() => {
    const valor = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const unidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
    return { totalValorInventario: valor, totalUnidades: unidades };
  }, [productos]);

  const productosFiltrados = useMemo(() =>
    productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        producto.numeroLote.toLowerCase().includes(terminoBusqueda.toLowerCase())
    ),
    [productos, terminoBusqueda]
  );

  const alertasStockBajo = useMemo(() =>
    productos.filter((p) => p.cantidad > 0 && p.cantidad <= UMBRAL_STOCK_BAJO),
    [productos]
  );

  const alertasVencimiento = useMemo(() => {
    const hoy = new Date();
    const fechaUmbral = addDays(hoy, UMBRAL_DIAS_VENCIMIENTO);
    return productos.filter(p => isWithinInterval(new Date(p.fechaVencimiento), { start: subDays(hoy, 1), end: fechaUmbral }));
  }, [productos]);

  const agregarProducto = async (producto: Omit<Producto, 'id'>) => {
    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });

      if (!response.ok) {
        throw new Error('La respuesta de la red no fue correcta');
      }

      const productoAgregado = await response.json();
      
      const productoFinal = {
          ...productoAgregado,
          fechaVencimiento: new Date(productoAgregado.fechaVencimiento)
      };

      setProductos([...productos, productoFinal]);
      setFormularioAbierto(false);
      notificacion({
        title: 'Éxito',
        description: 'Producto agregado correctamente.',
      });
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      notificacion({
        title: 'Error',
        description: 'No se pudo agregar el producto. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };
  
  const actualizarProducto = async (productoActualizado: Producto) => {
    try {
        const response = await fetch(`/api/productos/${productoActualizado.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoActualizado),
        });

        if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta');
        }

        const productoDevuelto = await response.json();
        const productoFinal = {
            ...productoDevuelto,
            fechaVencimiento: new Date(productoDevuelto.fechaVencimiento),
        };

        setProductos(productos.map(p => p.id === productoFinal.id ? productoFinal : p));
        setProductoEnEdicion(null);
        setFormularioAbierto(false);
        notificacion({
            title: 'Éxito',
            description: 'Producto actualizado correctamente.',
        });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        notificacion({
            title: 'Error',
            description: 'No se pudo actualizar el producto. Inténtalo de nuevo.',
            variant: 'destructive',
        });
    }
  };

  const eliminarProducto = async (productoId: string) => {
     try {
        const response = await fetch(`/api/productos/${productoId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta');
        }

        setProductos(productos.filter(p => p.id !== productoId));
        notificacion({
            title: 'Éxito',
            description: 'Producto eliminado correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        notificacion({
            title: 'Error',
            description: 'No se pudo eliminar el producto. Inténtalo de nuevo.',
            variant: 'destructive',
        });
    }
  }

  const abrirFormularioEditar = (producto: Producto) => {
    setProductoEnEdicion(producto);
    setFormularioAbierto(true);
  }

  const abrirFormularioNuevo = () => {
    setProductoEnEdicion(null);
    setFormularioAbierto(true);
  }
  
  return (
    <Tabs defaultValue="panel" className="space-y-4">
      <TabsList>
        <TabsTrigger value="panel">Panel de Inventario</TabsTrigger>
        <TabsTrigger value="products">Productos</TabsTrigger>
        <TabsTrigger value="alerts">Alertas</TabsTrigger>
      </TabsList>

      <TabsContent value="panel">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total del Inventario</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                 {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalValorInventario)}
              </div>
              <p className="text-xs text-muted-foreground">
                Calculado sobre {productos.length} productos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades Totales en Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUnidades.toLocaleString('es-CO')}</div>
              <p className="text-xs text-muted-foreground">
                Sumatoria de todos los productos
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="products">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre, categoría..."
                  className="w-full pl-8"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                />
              </div>
              <Button onClick={abrirFormularioNuevo}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Registrar Producto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productosFiltrados.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{producto.categoria}</Badge>
                    </TableCell>
                    <TableCell>{producto.proveedorNombre || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(producto.precio)}
                    </TableCell>
                    <TableCell className="text-right">{producto.cantidad}</TableCell>
                    <TableCell>
                       <span className={isBefore(new Date(producto.fechaVencimiento), new Date()) ? 'text-destructive' : ''}>
                         {format(new Date(producto.fechaVencimiento), 'dd/MM/yyyy')}
                       </span>
                    </TableCell>
                    <TableCell>{producto.numeroLote}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => abrirFormularioEditar(producto)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => eliminarProducto(producto.id)} className="text-destructive">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="alerts">
         <div className="grid gap-6">
            <div>
               <h3 className="text-lg font-medium mb-2">Alertas de Stock Bajo</h3>
               <div className="space-y-4">
                  {alertasStockBajo.length > 0 ? (
                     alertasStockBajo.map(producto => (
                       <Alert key={producto.id}>
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle>{producto.nombre}</AlertTitle>
                         <AlertDescription>
                           Stock bajo: {producto.cantidad} unidades restantes.
                         </AlertDescription>
                       </Alert>
                     ))
                  ) : <p className="text-sm text-muted-foreground">No hay alertas de stock bajo.</p>}
               </div>
            </div>
             <div>
               <h3 className="text-lg font-medium mb-2">Alertas de Vencimiento</h3>
               <div className="space-y-4">
                  {alertasVencimiento.length > 0 ? (
                     alertasVencimiento.map(producto => (
                       <Alert key={producto.id} variant={isBefore(new Date(producto.fechaVencimiento), new Date()) ? 'destructive' : 'default'}>
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle>{producto.nombre} ({producto.numeroLote})</AlertTitle>
                         <AlertDescription>
                           {isBefore(new Date(producto.fechaVencimiento), new Date()) ? 'Ha vencido el' : 'Vence el'} {format(new Date(producto.fechaVencimiento), 'PPP', { locale: es })}.
                         </AlertDescription>
                       </Alert>
                     ))
                  ) : <p className="text-sm text-muted-foreground">No hay productos próximos a vencer.</p>}
               </div>
            </div>
         </div>
      </TabsContent>
      
      <Dialog open={formularioAbierto} onOpenChange={setFormularioAbierto}>
        <DialogContent className="sm:max-w-md">
          <FormularioProducto
            producto={productoEnEdicion}
            onAgregar={agregarProducto}
            onActualizar={actualizarProducto}
            categorias={categorias}
            proveedores={proveedores}
          />
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}

function FormularioProducto({ 
  producto, 
  onAgregar, 
  onActualizar, 
  categorias,
  proveedores
}: { 
  producto: Producto | null, 
  onAgregar: (p: Omit<Producto, 'id'>) => Promise<void>, 
  onActualizar: (p: Producto) => Promise<void>, 
  categorias: Categoria[],
  proveedores: Proveedor[]
}) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | undefined>(new Date());
  const [numeroLote, setNumeroLote] = useState('');

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setCategoria(producto.categoria);
      setPrecio(producto.precio);
      setCantidad(producto.cantidad);
      setFechaVencimiento(new Date(producto.fechaVencimiento));
      setNumeroLote(producto.numeroLote);
      setProveedorId(producto.proveedorId || '');
    } else {
      setNombre('');
      setCategoria(categorias.length > 0 ? categorias[0].nombre : '');
      setPrecio(0);
      setCantidad(0);
      setFechaVencimiento(new Date());
      setNumeroLote('');
      setProveedorId('');
    }
  }, [producto, categorias, proveedores]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaVencimiento || !categoria) return;
    
    const proveedorSeleccionado = proveedores.find(p => p.id === proveedorId);
    
    const datosProducto: Omit<Producto, 'id'> = { 
        nombre, 
        categoria, 
        precio, 
        cantidad, 
        fechaVencimiento, 
        numeroLote,
        proveedorId: proveedorSeleccionado?.id,
        proveedorNombre: proveedorSeleccionado?.nombre,
    };

    if (producto) {
      await onActualizar({ ...datosProducto, id: producto.id });
    } else {
      await onAgregar(datosProducto);
    }
  };

  return (
    <form onSubmit={handleEnviar}>
      <DialogHeader>
        <DialogTitle>{producto ? 'Editar Producto' : 'Registrar Producto'}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
            <label htmlFor="name">Nombre</label>
            <Input id="name" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="category">Categoría</label>
                <select id="category" value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                    <option value="" disabled>Selecciona una categoría</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
                <label htmlFor="provider">Proveedor</label>
                <select id="provider" value={proveedorId} onChange={e => setProveedorId(e.target.value)} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Ninguno</option>
                    {proveedores.map(prov => (
                        <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                    ))}
                </select>
            </div>
        </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="price">Precio</label>
                <Input id="price" type="number" value={precio} onChange={e => setPrecio(parseFloat(e.target.value) || 0)} required />
            </div>
            <div className="space-y-2">
                <label htmlFor="quantity">Cantidad</label>
                <Input id="quantity" type="number" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value, 10) || 0)} required />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label>Fecha de Vencimiento</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fechaVencimiento ? format(fechaVencimiento, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={fechaVencimiento} onSelect={setFechaVencimiento} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <label htmlFor="lotNumber">Número de Lote</label>
                <Input id="lotNumber" value={numeroLote} onChange={e => setNumeroLote(e.target.value)} required />
            </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit">Guardar Cambios</Button>
      </DialogFooter>
    </form>
  );
}
