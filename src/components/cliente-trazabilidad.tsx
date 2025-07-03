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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, PackageSearch, History } from 'lucide-react';
import { format } from 'date-fns';
import { type MovimientoInventario, TipoMovimiento } from '@/lib/types';

interface ClienteTrazabilidadProps {
  movimientosIniciales: MovimientoInventario[];
}

export function ClienteTrazabilidad({ movimientosIniciales }: ClienteTrazabilidadProps) {
  const [loteBuscado, setLoteBuscado] = useState('');
  const [loteActual, setLoteActual] = useState('');

  const movimientosFiltrados = useMemo(() => {
    if (!loteActual) return [];
    return movimientosIniciales.filter(
      (m) => m.numeroLote && m.numeroLote.toLowerCase() === loteActual.toLowerCase()
    );
  }, [movimientosIniciales, loteActual]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setLoteActual(loteBuscado);
  };

  const tiposDeSalida = [
    TipoMovimiento.AJUSTE_NEGATIVO,
    TipoMovimiento.SALIDA_MANUAL,
    TipoMovimiento.DISPENSADO_RECETA,
    TipoMovimiento.DEVOLUCION_PROVEEDOR,
    TipoMovimiento.VENTA_KIT,
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Trazabilidad de Lotes</CardTitle>
            <CardDescription>
              Ingresa un número de lote para ver su historial completo de movimientos.
            </CardDescription>
          </div>
          <form onSubmit={handleBuscar} className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Buscar por número de lote..."
                className="w-full pl-8"
                value={loteBuscado}
                onChange={(e) => setLoteBuscado(e.target.value)}
                />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
        </div>
      </CardHeader>
      <CardContent>
        {loteActual ? (
          movimientosFiltrados.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo Movimiento</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-center">Stock Anterior</TableHead>
                    <TableHead className="text-center">Stock Nuevo</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientosFiltrados.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>{format(new Date(mov.fecha), 'dd/MM/yy HH:mm')}</TableCell>
                      <TableCell className="font-medium">{mov.productoNombre}</TableCell>
                      <TableCell><Badge variant="secondary">{mov.tipo}</Badge></TableCell>
                      <TableCell className={`text-center font-medium ${tiposDeSalida.includes(mov.tipo) ? 'text-destructive' : 'text-emerald-600'}`}>
                        {tiposDeSalida.includes(mov.tipo) ? '-' : '+'}
                        {mov.cantidadMovida}
                      </TableCell>
                      <TableCell className="text-center">{mov.stockAnterior}</TableCell>
                      <TableCell className="text-center">{mov.stockNuevo}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{mov.notas || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-64 text-center">
                <History className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold">No se encontraron movimientos</p>
                <p className="text-muted-foreground">
                  No hay registros para el lote "{loteActual}". Verifica el número o registra movimientos para ese lote.
                </p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <PackageSearch className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Inicia una búsqueda</p>
            <p className="text-muted-foreground">
              Usa el campo de búsqueda para rastrear un lote específico.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
