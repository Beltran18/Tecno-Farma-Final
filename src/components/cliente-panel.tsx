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
  CardDescription,
} from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, DollarSign, Package, AlertTriangle, PlusCircle, Search, Calendar as CalendarIcon, Settings, Upload, Download, CalendarOff, PackagePlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, isWithinInterval, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

import { type Producto, type Categoria, type Proveedor } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClientePanelProps {
  productosIniciales: Producto[];
}

export function ClientePanel({ productosIniciales }: ClientePanelProps) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [umbralStockBajo, setUmbralStockBajo] = useState(10);
  const [umbralDiasVencimiento, setUmbralDiasVencimiento] = useState(30);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
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
    productos.filter((p) => p.cantidad > 0 && p.cantidad <= umbralStockBajo),
    [productos, umbralStockBajo]
  );

  const alertasVencimiento = useMemo(() => {
    const hoy = new Date();
    const fechaUmbral = addDays(hoy, umbralDiasVencimiento);
    return productos.filter(p => isWithinInterval(new Date(p.fechaVencimiento), { start: subDays(hoy, 1), end: fechaUmbral }));
  }, [productos, umbralDiasVencimiento]);

  const productosRecientes = useMemo(() => {
    return [...productos]
        .sort((a, b) => b.id.localeCompare(a.id))
        .slice(0, 5);
  }, [productos]);

  const distribucionCategorias = useMemo(() => {
    if (productos.length === 0) return [];
    
    const conteo = productos.reduce((acc, producto) => {
      acc[producto.categoria] = (acc[producto.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(conteo)
        .map(([categoria, total], index) => ({
            categoria,
            total,
            fill: `hsl(var(--chart-${(index % 5) + 1}))`
        }))
        .sort((a, b) => b.total - a.total);
  }, [productos]);

  const chartConfig = useMemo(() => ({
    total: {
      label: 'Total',
    },
    ...distribucionCategorias.reduce((acc, item) => {
        acc[item.categoria] = { label: item.categoria, color: item.fill };
        return acc;
    }, {} as ChartConfig)
  }), [distribucionCategorias]) satisfies ChartConfig;

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

  const handleImportarProductos = async () => {
    if (!importFile) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', importFile);

    try {
        const response = await fetch('/api/productos/importar', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al importar productos');
        }

        const { message, productosImportados } = await response.json();
        
        const productosFinales = productosImportados.map((p: Producto) => ({
            ...p,
            fechaVencimiento: new Date(p.fechaVencimiento),
        }));

        setProductos(prev => [...prev, ...productosFinales]);
        notificacion({
            title: 'Éxito',
            description: message,
        });
    } catch (error: any) {
        notificacion({
            title: 'Error de Importación',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setIsImporting(false);
        setImportFile(null);
        setImportDialogOpen(false);
    }
  };

  const handleExportarProductos = () => {
    if (productos.length === 0) {
        notificacion({
            title: 'Inventario Vacío',
            description: 'No hay productos para exportar.',
            variant: 'destructive',
        });
        return;
    }

    const headers = ['nombre', 'categoria', 'precio', 'cantidad', 'fechaVencimiento', 'numeroLote', 'proveedorNombre'];
    const csvRows = [
      headers.join(','),
      ...productos.map(p => [
        `"${p.nombre.replace(/"/g, '""')}"`,
        `"${p.categoria.replace(/"/g, '""')}"`,
        p.precio,
        p.cantidad,
        format(new Date(p.fechaVencimiento), 'yyyy-MM-dd'),
        `"${p.numeroLote.replace(/"/g, '""')}"`,
        `"${(p.proveedorNombre || '').replace(/"/g, '""')}"`,
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    notificacion({
        title: 'Éxito',
        description: 'La exportación del inventario ha comenzado.',
    });
  };

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
        <TabsTrigger value="panel">Panel de Control</TabsTrigger>
        <TabsTrigger value="products">Productos</TabsTrigger>
        <TabsTrigger value="alerts">Alertas</TabsTrigger>
      </TabsList>

      <TabsContent value="panel">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas de Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertasStockBajo.length}</div>
              <p className="text-xs text-muted-foreground">
                Umbral: {umbralStockBajo} unidades
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos a Vencer</CardTitle>
              <CalendarOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertasVencimiento.length}</div>
              <p className="text-xs text-muted-foreground">
                En los próximos {umbralDiasVencimiento} días
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Distribución por Categoría</CardTitle>
                    <CardDescription>
                        Visualización de la cantidad de productos en cada categoría.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  {distribucionCategorias.length > 0 ? (
                    <ChartContainer config={chartConfig} className="min-h-[250px] w-full aspect-auto">
                      <PieChart>
                          <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideLabel nameKey="categoria" />}
                          />
                          <Pie data={distribucionCategorias} dataKey="total" nameKey="categoria" innerRadius={60}>
                             {distribucionCategorias.map((entry) => (
                                <Cell key={`cell-${entry.categoria}`} fill={entry.fill} />
                            ))}
                          </Pie>
                      </PieChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[250px]">
                      <p className="text-sm text-muted-foreground">No hay datos para mostrar el gráfico.</p>
                    </div>
                  )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Productos Recientes</CardTitle>
                    <CardDescription>
                        Los últimos productos agregados al inventario.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {productosRecientes.length > 0 ? (
                            productosRecientes.map(producto => (
                                <div key={producto.id} className="flex items-center">
                                    <div className="p-2 bg-muted rounded-full mr-4">
                                        <PackagePlus className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium">{producto.nombre}</p>
                                        <p className="text-xs text-muted-foreground">{producto.categoria} - Lote: {producto.numeroLote}</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {format(new Date(producto.fechaVencimiento), 'dd/MM/yy')}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-[250px]">
                                <p className="text-sm text-muted-foreground">No hay productos recientes.</p>
                             </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </TabsContent>

      <TabsContent value="products">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:w-auto">
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
              </div>
              <div className="flex flex-wrap gap-2">
                 <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar
                </Button>
                <Button variant="outline" onClick={handleExportarProductos}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                </Button>
                <Button onClick={abrirFormularioNuevo}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Registrar Producto
                </Button>
              </div>
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

      <TabsContent value="alerts" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Settings className="h-6 w-6 text-muted-foreground" />
              <div>
                <CardTitle>Configuración de Alertas</CardTitle>
                <CardDescription>
                  Define los umbrales para las notificaciones de inventario.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="stock-threshold">Umbral de Stock Bajo</Label>
                <Input
                  id="stock-threshold"
                  type="number"
                  value={umbralStockBajo}
                  onChange={(e) =>
                    setUmbralStockBajo(
                      Number(e.target.value) >= 0 ? Number(e.target.value) : 0
                    )
                  }
                  min="0"
                />
                <p className="text-sm text-muted-foreground">
                  Recibir alertas para productos con esta cantidad o menos.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry-threshold">
                  Umbral de Vencimiento (días)
                </Label>
                <Input
                  id="expiry-threshold"
                  type="number"
                  value={umbralDiasVencimiento}
                  onChange={(e) =>
                    setUmbralDiasVencimiento(
                      Number(e.target.value) >= 0 ? Number(e.target.value) : 0
                    )
                  }
                  min="0"
                />
                <p className="text-sm text-muted-foreground">
                  Alertar sobre productos que vencen en los próximos X días.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

         <div className="grid gap-6">
            <div>
               <h3 className="text-lg font-medium mb-2">Alertas de Stock Bajo ({alertasStockBajo.length})</h3>
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
               <h3 className="text-lg font-medium mb-2">Alertas de Vencimiento ({alertasVencimiento.length})</h3>
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

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Productos desde CSV</DialogTitle>
            <DialogDescription>
              El archivo debe tener las columnas: nombre, categoria, precio, cantidad, fechaVencimiento (en formato AAAA-MM-DD), numeroLote, proveedorNombre (opcional).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleImportarProductos} disabled={!importFile || isImporting}>
              {isImporting ? 'Importando...' : 'Subir e Importar'}
            </Button>
          </DialogFooter>
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
                <Input id="price" type="number" value={precio} onChange={e => setPrecio(parseFloat(e.target.value) || 0)} required min="0" />
            </div>
            <div className="space-y-2">
                <label htmlFor="quantity">Cantidad</label>
                <Input id="quantity" type="number" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value, 10) || 0)} required min="0"/>
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
