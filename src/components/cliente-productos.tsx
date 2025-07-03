'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Card,
  CardContent,
  CardHeader,
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
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Search, Calendar as CalendarIcon, Upload, Download, Printer, MinusCircle, History, Trash2, DollarSign } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

import { type Producto, type Categoria, type Proveedor, type MovimientoInventario, TipoMovimiento } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClienteProductosProps {
  productosIniciales: Producto[];
  categoriasIniciales: Categoria[];
  proveedoresIniciales: Proveedor[];
}

export function ClienteProductos({ productosIniciales, categoriasIniciales, proveedoresIniciales }: ClienteProductosProps) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasIniciales);
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresIniciales);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [salidaDialogOpen, setSalidaDialogOpen] = useState(false);
  const [productoParaSalida, setProductoParaSalida] = useState<Producto | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [productoParaHistorial, setProductoParaHistorial] = useState<Producto | null>(null);
  const [salesHistoryDialogOpen, setSalesHistoryDialogOpen] = useState(false);
  const [productoParaHistorialVentas, setProductoParaHistorialVentas] = useState<Producto | null>(null);
  const [productoParaEliminar, setProductoParaEliminar] = useState<Producto | null>(null);


  const { notificacion } = usarNotificacion();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const productosFiltrados = useMemo(() =>
    productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        producto.numeroLote.toLowerCase().includes(terminoBusqueda.toLowerCase())
    ),
    [productos, terminoBusqueda]
  );

  const agregarProducto = async (producto: Omit<Producto, 'id'>) => {
    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al agregar el producto.');
      }
      
      const productoFinal = {
          ...data,
          fechaVencimiento: new Date(data.fechaVencimiento)
      };

      setProductos([...productos, productoFinal]);
      setFormularioAbierto(false);
      notificacion({
        title: 'Éxito',
        description: 'Producto agregado correctamente.',
      });
    } catch (error: any) {
      console.error('Error al agregar el producto:', error);
      notificacion({
        title: 'Error',
        description: error.message || 'No se pudo agregar el producto. Inténtalo de nuevo.',
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

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar el producto.');
        }

        const productoFinal = {
            ...data,
            fechaVencimiento: new Date(data.fechaVencimiento),
        };

        setProductos(productos.map(p => p.id === productoFinal.id ? productoFinal : p));
        setProductoEnEdicion(null);
        setFormularioAbierto(false);
        notificacion({
            title: 'Éxito',
            description: 'Producto actualizado correctamente.',
        });
    } catch (error: any) {
        console.error('Error al actualizar el producto:', error);
        notificacion({
            title: 'Error',
            description: error.message || 'No se pudo actualizar el producto. Inténtalo de nuevo.',
            variant: 'destructive',
        });
    }
  };

  const handleEliminarProducto = async () => {
     if (!productoParaEliminar) return;

     try {
        const response = await fetch(`/api/productos/${productoParaEliminar.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'No se pudo eliminar el producto.');
        }

        setProductos(productos.filter(p => p.id !== productoParaEliminar.id));
        notificacion({
            title: 'Éxito',
            description: 'Producto eliminado correctamente.',
        });
    } catch (error: any) {
        console.error('Error al eliminar el producto:', error);
        notificacion({
            title: 'Error',
            description: error.message || 'No se pudo eliminar el producto. Inténtalo de nuevo.',
            variant: 'destructive',
        });
    } finally {
        setProductoParaEliminar(null);
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

    const headers = ['nombre', 'categoria', 'costo', 'precio', 'descuento', 'cantidad', 'fechaVencimiento', 'numeroLote', 'proveedorNombre', 'fechaInicioGarantia', 'fechaFinGarantia'];
    const csvRows = [
      headers.join(','),
      ...productos.map(p => [
        `"${p.nombre.replace(/"/g, '""')}"`,
        `"${p.categoria.replace(/"/g, '""')}"`,
        p.costo,
        p.precio,
        p.descuento || 0,
        p.cantidad,
        format(new Date(p.fechaVencimiento), 'yyyy-MM-dd'),
        `"${p.numeroLote.replace(/"/g, '""')}"`,
        `"${(p.proveedorNombre || '').replace(/"/g, '""')}"`,
        p.fechaInicioGarantia ? format(new Date(p.fechaInicioGarantia), 'yyyy-MM-dd') : '',
        p.fechaFinGarantia ? format(new Date(p.fechaFinGarantia), 'yyyy-MM-dd') : '',
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

  const abrirFormularioSalida = (producto: Producto) => {
    setProductoParaSalida(producto);
    setSalidaDialogOpen(true);
  };

  const abrirDialogoHistorial = (producto: Producto) => {
    setProductoParaHistorial(producto);
    setHistoryDialogOpen(true);
  };

  const abrirDialogoHistorialVentas = (producto: Producto) => {
    setProductoParaHistorialVentas(producto);
    setSalesHistoryDialogOpen(true);
  };
  
  return (
    <>
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
                    <TableCell className="font-medium">
                      {producto.nombre}
                      {producto.descuento && producto.descuento > 0 && (
                        <Badge variant="destructive" className="ml-2">-{producto.descuento}%</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{producto.categoria}</Badge>
                    </TableCell>
                    <TableCell>{producto.proveedorNombre || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      {producto.descuento && producto.descuento > 0 ? (
                        <div>
                          <span className="font-bold">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(producto.precio * (1 - producto.descuento / 100))}
                          </span>
                          <del className="text-xs text-muted-foreground ml-1">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(producto.precio)}
                          </del>
                        </div>
                      ) : (
                        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(producto.precio)
                      )}
                    </TableCell>
                    <TableCell className="text-right">{producto.cantidad}</TableCell>
                    <TableCell>
                       <span className={isClient && isBefore(new Date(producto.fechaVencimiento), new Date()) ? 'text-destructive' : ''}>
                         {isClient ? format(new Date(producto.fechaVencimiento), 'dd/MM/yyyy') : ''}
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
                          <DropdownMenuItem onSelect={() => abrirFormularioSalida(producto)}>
                            <MinusCircle className="mr-2 h-4 w-4" />
                            <span>Registrar Salida</span>
                          </DropdownMenuItem>
                           <DropdownMenuItem onSelect={() => abrirDialogoHistorial(producto)}>
                            <History className="mr-2 h-4 w-4" />
                            <span>Ver Historial</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => abrirDialogoHistorialVentas(producto)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            <span>Historial de Ventas</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => router.push(`/panel/imprimir-etiqueta/${producto.id}`)}>
                            <Printer className="mr-2 h-4 w-4" />
                            <span>Imprimir Etiqueta</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setProductoParaEliminar(producto)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      
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
              El archivo debe tener las columnas: nombre, categoria, costo, precio, descuento, cantidad, fechaVencimiento (AAAA-MM-DD), numeroLote, proveedorNombre (opcional), fechaInicioGarantia (opcional), fechaFinGarantia (opcional).
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

      <Dialog open={salidaDialogOpen} onOpenChange={setSalidaDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <FormularioSalidaProducto
                producto={productoParaSalida}
                onGuardar={handleRegistrarSalida}
            />
        </DialogContent>
      </Dialog>

      <HistorialProductoDialog 
        producto={productoParaHistorial}
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
      />

      <HistorialVentasDialog
        producto={productoParaHistorialVentas}
        open={salesHistoryDialogOpen}
        onOpenChange={setSalesHistoryDialogOpen}
      />

      <AlertDialog open={!!productoParaEliminar} onOpenChange={(open) => !open && setProductoParaEliminar(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro de eliminar este producto?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el producto "{productoParaEliminar?.nombre}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleEliminarProducto}>Sí, eliminar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
  const [costo, setCosto] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | undefined>(new Date());
  const [numeroLote, setNumeroLote] = useState('');
  const [fechaInicioGarantia, setFechaInicioGarantia] = useState<Date | undefined>();
  const [fechaFinGarantia, setFechaFinGarantia] = useState<Date | undefined>();

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setCategoria(producto.categoria);
      setCosto(producto.costo);
      setPrecio(producto.precio);
      setDescuento(producto.descuento || 0);
      setCantidad(producto.cantidad);
      setFechaVencimiento(new Date(producto.fechaVencimiento));
      setNumeroLote(producto.numeroLote);
      setProveedorId(producto.proveedorId || '');
      setFechaInicioGarantia(producto.fechaInicioGarantia ? new Date(producto.fechaInicioGarantia) : undefined);
      setFechaFinGarantia(producto.fechaFinGarantia ? new Date(producto.fechaFinGarantia) : undefined);
    } else {
      setNombre('');
      setCategoria(categorias.length > 0 ? categorias[0].nombre : '');
      setCosto(0);
      setPrecio(0);
      setDescuento(0);
      setCantidad(0);
      setFechaVencimiento(new Date());
      setNumeroLote('');
      setProveedorId('');
      setFechaInicioGarantia(undefined);
      setFechaFinGarantia(undefined);
    }
  }, [producto, categorias, proveedores]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaVencimiento || !categoria) return;
    
    const proveedorSeleccionado = proveedores.find(p => p.id === proveedorId);
    
    const datosProducto = { 
        nombre, 
        categoria, 
        costo,
        precio, 
        descuento,
        cantidad, 
        fechaVencimiento, 
        numeroLote,
        proveedorId: proveedorSeleccionado?.id,
        proveedorNombre: proveedorSeleccionado?.nombre,
        fechaInicioGarantia,
        fechaFinGarantia,
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
         <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
                <label htmlFor="costo">Costo</label>
                <Input id="costo" type="number" value={costo} onChange={e => setCosto(parseFloat(e.target.value) || 0)} required min="0" step="any" />
            </div>
            <div className="space-y-2">
                <label htmlFor="price">Precio</label>
                <Input id="price" type="number" value={precio} onChange={e => setPrecio(parseFloat(e.target.value) || 0)} required min="0" step="any" />
            </div>
            <div className="space-y-2">
                <label htmlFor="descuento">Desc. (%)</label>
                <Input id="descuento" type="number" value={descuento} onChange={e => setDescuento(parseFloat(e.target.value) || 0)} min="0" max="100" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="quantity">Cantidad</label>
                <Input id="quantity" type="number" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value, 10) || 0)} required min="0"/>
            </div>
            <div className="space-y-2">
                <label htmlFor="lotNumber">Número de Lote</label>
                <Input id="lotNumber" value={numeroLote} onChange={e => setNumeroLote(e.target.value)} required />
            </div>
        </div>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
              <label>Inicio Garantía (Opcional)</label>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fechaInicioGarantia ? format(fechaInicioGarantia, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={fechaInicioGarantia} onSelect={setFechaInicioGarantia} initialFocus />
                  </PopoverContent>
              </Popover>
          </div>
          <div className="space-y-2">
              <label>Fin Garantía (Opcional)</label>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fechaFinGarantia ? format(fechaFinGarantia, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={fechaFinGarantia} onSelect={setFechaFinGarantia} initialFocus />
                  </PopoverContent>
              </Popover>
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

function FormularioSalidaProducto({ 
  producto, 
  onGuardar 
}: { 
  producto: Producto | null, 
  onGuardar: (cantidadSalida: number) => Promise<void>, 
}) {
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    setCantidad(1);
  }, [producto]);

  if (!producto) return null;

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGuardar(cantidad);
  };

  return (
    <form onSubmit={handleEnviar}>
      <DialogHeader>
        <DialogTitle>Registrar Salida de Producto</DialogTitle>
        <DialogDescription>
          Vas a registrar una salida para: <strong>{producto.nombre}</strong>. Stock actual: {producto.cantidad.toLocaleString('es-CO')} unidades.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
            <label htmlFor="cantidad-salida">Cantidad a retirar</label>
            <Input
              id="cantidad-salida"
              type="number"
              value={cantidad}
              onChange={e => setCantidad(parseInt(e.target.value, 10) || 0)}
              required
              min="1"
              max={producto.cantidad}
              placeholder="Ej: 5"
            />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit">Guardar Salida</Button>
      </DialogFooter>
    </form>
  );
}

function HistorialProductoDialog({ producto, open, onOpenChange }: { producto: Producto | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [historial, setHistorial] = useState<MovimientoInventario[]>([]);
  const [cargando, setCargando] = useState(false);
  
  useEffect(() => {
    if (open && producto) {
      const fetchHistorial = async () => {
        setCargando(true);
        try {
          const response = await fetch(`/api/movimientos/${producto.id}`);
          if (!response.ok) {
            throw new Error('No se pudo cargar el historial');
          }
          const data = await response.json();
          setHistorial(data);
        } catch (error) {
          console.error(error);
          setHistorial([]);
        } finally {
          setCargando(false);
        }
      };
      fetchHistorial();
    }
  }, [open, producto]);

  if (!producto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Historial de Movimientos</DialogTitle>
          <DialogDescription>Producto: {producto.nombre} - Lote: {producto.numeroLote}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          {cargando ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Cargando historial...</p>
          ) : historial.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className='text-center'>Cantidad</TableHead>
                  <TableHead className='text-center'>Stock Anterior</TableHead>
                  <TableHead className='text-center'>Stock Nuevo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>{format(new Date(mov.fecha), 'dd/MM/yy HH:mm')}</TableCell>
                    <TableCell><Badge variant="secondary">{mov.tipo}</Badge></TableCell>
                    <TableCell className={`text-center font-medium ${[TipoMovimiento.AJUSTE_NEGATIVO, TipoMovimiento.SALIDA_MANUAL].includes(mov.tipo) ? 'text-destructive' : 'text-emerald-600'}`}>
                        {[TipoMovimiento.AJUSTE_NEGATIVO, TipoMovimiento.SALIDA_MANUAL].includes(mov.tipo) ? '-' : '+'}
                        {mov.cantidadMovida}
                    </TableCell>
                    <TableCell className='text-center'>{mov.stockAnterior}</TableCell>
                    <TableCell className='text-center'>{mov.stockNuevo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No hay movimientos registrados para este producto.</p>
          )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cerrar</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HistorialVentasDialog({ producto, open, onOpenChange }: { producto: Producto | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [historial, setHistorial] = useState<MovimientoInventario[]>([]);
  const [cargando, setCargando] = useState(false);
  const tiposVenta = useMemo(() => [TipoMovimiento.SALIDA_MANUAL, TipoMovimiento.DISPENSADO_RECETA, TipoMovimiento.VENTA_KIT], []);

  useEffect(() => {
    if (open && producto) {
      const fetchHistorial = async () => {
        setCargando(true);
        try {
          const response = await fetch(`/api/movimientos/${producto.id}`);
          if (!response.ok) throw new Error('No se pudo cargar el historial de ventas');
          const data = await response.json();
          setHistorial(data.filter((m: MovimientoInventario) => tiposVenta.includes(m.tipo)));
        } catch (error) {
          console.error(error);
          setHistorial([]);
        } finally {
          setCargando(false);
        }
      };
      fetchHistorial();
    }
  }, [open, producto, tiposVenta]);

  if (!producto) return null;

  const precioVenta = producto.descuento ? producto.precio * (1 - producto.descuento / 100) : producto.precio;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Historial de Ventas</DialogTitle>
          <DialogDescription>Producto: {producto.nombre} - Lote: {producto.numeroLote}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          {cargando ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Cargando historial de ventas...</p>
          ) : historial.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo de Venta</TableHead>
                  <TableHead className='text-right'>Cantidad</TableHead>
                  <TableHead className='text-right'>Precio Unitario</TableHead>
                  <TableHead className='text-right'>Total Venta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>{format(new Date(mov.fecha), 'dd/MM/yy HH:mm')}</TableCell>
                    <TableCell><Badge variant="secondary">{mov.tipo}</Badge></TableCell>
                    <TableCell className='text-right'>{mov.cantidadMovida}</TableCell>
                    <TableCell className='text-right'>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precioVenta)}</TableCell>
                    <TableCell className='text-right font-medium'>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precioVenta * mov.cantidadMovida)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No hay historial de ventas para este producto.</p>
          )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cerrar</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
