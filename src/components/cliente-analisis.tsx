'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { type Producto, type MovimientoInventario, TipoMovimiento } from '@/lib/types';
import { DollarSign, PackageMinus, TrendingUp, BarChart3 } from 'lucide-react';

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

export function ClienteAnalisis({ productos, movimientos }: { productos: Producto[], movimientos: MovimientoInventario[] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const analisis = useMemo(() => {
    const productosMap = new Map(productos.map(p => [p.id, p]));
    const tiposVenta = [TipoMovimiento.SALIDA_MANUAL, TipoMovimiento.DISPENSADO_RECETA, TipoMovimiento.VENTA_KIT];
    const movimientosVenta = movimientos.filter(m => tiposVenta.includes(m.tipo));

    const { ventasTotales, costoDeVentas } = movimientosVenta.reduce((acc, mov) => {
      const producto = productosMap.get(mov.productoId);
      if (producto) {
        const precioVenta = producto.descuento ? producto.precio * (1 - producto.descuento / 100) : producto.precio;
        acc.ventasTotales += precioVenta * mov.cantidadMovida;
        acc.costoDeVentas += (producto.costo || 0) * mov.cantidadMovida;
      }
      return acc;
    }, { ventasTotales: 0, costoDeVentas: 0 });

    const gananciaBruta = ventasTotales - costoDeVentas;

    const productosConRentabilidad = productos.map(p => {
      const precioVenta = p.descuento ? p.precio * (1 - p.descuento / 100) : p.precio;
      const margenPorUnidad = precioVenta - (p.costo || 0);
      const movimientosProducto = movimientosVenta.filter(m => m.productoId === p.id);
      const unidadesVendidas = movimientosProducto.reduce((sum, mov) => sum + mov.cantidadMovida, 0);
      const gananciaTotalProducto = margenPorUnidad * unidadesVendidas;
      return { ...p, precioVenta, margenPorUnidad, unidadesVendidas, gananciaTotalProducto };
    }).sort((a, b) => b.gananciaTotalProducto - a.gananciaTotalProducto);

    const rentabilidadPorCategoria = productosConRentabilidad
        .filter(p => p.unidadesVendidas > 0)
        .reduce((acc, p) => {
            const categoria = p.categoria;
            if (!acc[categoria]) {
                acc[categoria] = { ventas: 0, costo: 0, ganancia: 0, categoria };
            }
            acc[categoria].ganancia += p.gananciaTotalProducto;
            acc[categoria].ventas += p.precioVenta * p.unidadesVendidas;
            acc[categoria].costo += (p.costo || 0) * p.unidadesVendidas;
            return acc;
    }, {} as Record<string, { ventas: number; costo: number; ganancia: number; categoria: string }>);

    const datosGrafico = Object.values(rentabilidadPorCategoria)
        .filter(c => c.ganancia > 0)
        .sort((a, b) => b.ganancia - a.ganancia);

    return {
      ventasTotales,
      costoDeVentas,
      gananciaBruta,
      productosConRentabilidad,
      datosGrafico,
    };
  }, [productos, movimientos]);

  const chartConfig = {
    ganancia: {
      label: 'Ganancia',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Bruta Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isClient ? formatCurrency(analisis.gananciaBruta) : '$...'}
            </div>
            <p className="text-xs text-muted-foreground">Basado en ventas registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {isClient ? formatCurrency(analisis.ventasTotales) : '$...'}
            </div>
             <p className="text-xs text-muted-foreground">Ingresos totales por ventas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo de Ventas (COGS)</CardTitle>
            <PackageMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {isClient ? formatCurrency(analisis.costoDeVentas) : '$...'}
            </div>
            <p className="text-xs text-muted-foreground">Costo de los productos vendidos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rentabilidad por Producto</CardTitle>
            <CardDescription>Productos más rentables basados en la ganancia total generada.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Unidades Vendidas</TableHead>
                    <TableHead className="text-right">Margen/Unidad</TableHead>
                    <TableHead className="text-right">Ganancia Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analisis.productosConRentabilidad.filter(p => p.unidadesVendidas > 0).slice(0, 10).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nombre}</TableCell>
                      <TableCell className="text-right">{p.unidadesVendidas}</TableCell>
                      <TableCell className="text-right">{isClient ? formatCurrency(p.margenPorUnidad) : '...'}</TableCell>
                      <TableCell className="text-right font-bold">{isClient ? formatCurrency(p.gananciaTotalProducto) : '...'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ganancia por Categoría</CardTitle>
            <CardDescription>Suma de la ganancia total de todos los productos vendidos en cada categoría.</CardDescription>
          </CardHeader>
          <CardContent>
            {analisis.datosGrafico.length > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analisis.datosGrafico} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" dataKey="ganancia" axisLine={false} tickLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                            <YAxis type="category" dataKey="categoria" width={80} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <ChartTooltip
                                cursor={{fill: 'hsl(var(--muted))'}}
                                content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
                            />
                            <Bar dataKey="ganancia" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <BarChart3 className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-sm font-semibold">Aún no hay ganancias que mostrar</p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Registra una 'Salida de Producto', vende un 'Kit' o dispensa una 'Receta' para empezar a ver la rentabilidad aquí.
                    </p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
