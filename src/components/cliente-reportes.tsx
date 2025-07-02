'use client';

import React, { useMemo } from 'react';
import { type Producto } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, isBefore, isWithinInterval, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Printer, DollarSign, Package, AlertTriangle, CalendarOff } from 'lucide-react';
import { Logo } from './logo';

interface ClienteReportesProps {
  productos: Producto[];
}

const UMBRAL_STOCK_BAJO = 10;
const UMBRAL_DIAS_VENCIMIENTO = 30;

export function ClienteReportes({ productos }: ClienteReportesProps) {
  const { totalValorInventario, totalUnidades } = useMemo(() => {
    const valor = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const unidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
    return { totalValorInventario: valor, totalUnidades: unidades };
  }, [productos]);

  const alertasStockBajo = useMemo(() =>
    productos.filter((p) => p.cantidad > 0 && p.cantidad <= UMBRAL_STOCK_BAJO),
    [productos]
  );

  const alertasVencimiento = useMemo(() => {
    const hoy = new Date();
    const fechaUmbral = addDays(hoy, UMBRAL_DIAS_VENCIMIENTO);
    return productos.filter(p => isWithinInterval(new Date(p.fechaVencimiento), { start: subDays(hoy, 1), end: fechaUmbral }));
  }, [productos]);
  
  const fechaReporte = format(new Date(), "dd 'de' MMMM 'de' yyyy, h:mm a", { locale: es });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start no-imprimir">
        <div>
          <h1 className="text-2xl font-bold">Reporte de Inventario</h1>
          <p className="text-muted-foreground">
            Un resumen de tu inventario a la fecha de {fechaReporte}.
          </p>
        </div>
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Reporte
        </Button>
      </div>

      <div id="reporte-imprimible" className="space-y-8">
        <div className="hidden print:block mb-8">
            <div className="flex justify-between items-center pb-4 border-b">
                 <Logo />
                 <div className="text-right">
                    <h2 className="text-2xl font-bold">Reporte de Inventario</h2>
                    <p className="text-sm text-muted-foreground">{fechaReporte}</p>
                 </div>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="printable-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor del Inventario</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalValorInventario)}
                </div>
              </CardContent>
            </Card>
            <Card className="printable-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unidades en Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUnidades.toLocaleString('es-CO')}</div>
              </CardContent>
            </Card>
             <Card className="printable-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas de Stock Bajo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alertasStockBajo.length}</div>
              </CardContent>
            </Card>
             <Card className="printable-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximos a Vencer</CardTitle>
                <CalendarOff className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alertasVencimiento.length}</div>
              </CardContent>
            </Card>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Detalle del Inventario</CardTitle>
            <CardDescription>
              Lista completa de todos los productos actualmente en stock.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.length > 0 ? productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{producto.categoria}</Badge>
                    </TableCell>
                    <TableCell>{producto.proveedorNombre || 'N/A'}</TableCell>
                    <TableCell>{producto.numeroLote}</TableCell>
                    <TableCell>
                       <span className={isBefore(new Date(producto.fechaVencimiento), new Date()) ? 'text-destructive font-semibold' : ''}>
                         {format(new Date(producto.fechaVencimiento), 'dd/MM/yyyy')}
                       </span>
                    </TableCell>
                    <TableCell className="text-right">{producto.cantidad}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(producto.precio)}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(producto.precio * producto.cantidad)}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No hay productos en el inventario.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
