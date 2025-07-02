'use client';

import React, { useState, useMemo } from 'react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { type Producto } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface ClienteCalendarioProps {
  productos: Producto[];
}

export function ClienteCalendario({ productos }: ClienteCalendarioProps) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(new Date());

  const diasConVencimiento = useMemo(() => {
    return productos.map(p => new Date(p.fechaVencimiento));
  }, [productos]);

  const productosDelDiaSeleccionado = useMemo(() => {
    if (!fechaSeleccionada) return [];
    
    return productos.filter(p => {
      const fechaVencimiento = new Date(p.fechaVencimiento);
      return isSameDay(fechaVencimiento, fechaSeleccionada);
    });
  }, [productos, fechaSeleccionada]);

  const modifiers = {
    vencimiento: diasConVencimiento,
  };

  const modifiersClassNames = {
    vencimiento: 'day-vencimiento',
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Calendario de Vencimientos</CardTitle>
          <CardDescription>
            Selecciona un día para ver los productos que vencen. Los días con vencimientos están resaltados.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={fechaSeleccionada}
            onSelect={setFechaSeleccionada}
            locale={es}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="p-0"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            Vencen el {fechaSeleccionada ? format(fechaSeleccionada, 'PPP', { locale: es }) : '...'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {productosDelDiaSeleccionado.length > 0 ? (
              <ul className="space-y-4 pr-4">
                {productosDelDiaSeleccionado.map(producto => (
                  <li key={producto.id} className="flex justify-between items-center text-sm p-2 rounded-md border">
                    <div>
                      <p className="font-medium">{producto.nombre}</p>
                      <p className="text-xs text-muted-foreground">Lote: {producto.numeroLote}</p>
                    </div>
                    <Badge variant="outline">{producto.categoria}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground flex items-center justify-center h-full">No hay vencimientos para este día.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
