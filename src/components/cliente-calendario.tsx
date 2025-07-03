'use client';

import React, { useState, useMemo } from 'react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { type Producto, type PedidoReposicion, EstadoPedido } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { AlertTriangle, Truck } from 'lucide-react';

interface ClienteCalendarioProps {
  productos: Producto[];
  pedidos: PedidoReposicion[];
}

export function ClienteCalendario({ productos, pedidos }: ClienteCalendarioProps) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(new Date());

  const diasConVencimiento = useMemo(() => {
    return productos.map(p => new Date(p.fechaVencimiento));
  }, [productos]);

  const diasConPedido = useMemo(() => {
    return pedidos
      .filter(p => p.estado === EstadoPedido.PENDIENTE && p.fechaEntregaEstimada)
      .map(p => new Date(p.fechaEntregaEstimada!));
  }, [pedidos]);

  const eventosDelDiaSeleccionado = useMemo(() => {
    if (!fechaSeleccionada) return { vencimientos: [], entregas: [] };
    
    const vencimientos = productos.filter(p => isSameDay(new Date(p.fechaVencimiento), fechaSeleccionada));
    const entregas = pedidos.filter(p => p.fechaEntregaEstimada && isSameDay(new Date(p.fechaEntregaEstimada), fechaSeleccionada));

    return { vencimientos, entregas };
  }, [productos, pedidos, fechaSeleccionada]);

  const modifiers = {
    vencimiento: diasConVencimiento,
    pedido: diasConPedido,
  };

  const modifiersClassNames = {
    vencimiento: 'day-vencimiento',
    pedido: 'day-pedido',
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Calendario de Eventos</CardTitle>
          <CardDescription>
            Selecciona un día para ver los eventos. Los días con vencimientos (rojo) y entregas de pedidos (verde) están resaltados.
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
            Eventos del {fechaSeleccionada ? format(fechaSeleccionada, 'PPP', { locale: es }) : '...'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-6 pr-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Vencimientos ({eventosDelDiaSeleccionado.vencimientos.length})</h3>
                {eventosDelDiaSeleccionado.vencimientos.length > 0 ? (
                  <ul className="space-y-2">
                    {eventosDelDiaSeleccionado.vencimientos.map(producto => (
                      <li key={`venc-${producto.id}`} className="flex justify-between items-center text-sm p-2 rounded-md border">
                        <div>
                          <p className="font-medium">{producto.nombre}</p>
                          <p className="text-xs text-muted-foreground">Lote: {producto.numeroLote}</p>
                        </div>
                        <Badge variant="outline">{producto.categoria}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay vencimientos.</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Entregas de Pedidos ({eventosDelDiaSeleccionado.entregas.length})</h3>
                {eventosDelDiaSeleccionado.entregas.length > 0 ? (
                  <ul className="space-y-2">
                    {eventosDelDiaSeleccionado.entregas.map(pedido => (
                      <li key={`ped-${pedido.id}`} className="flex justify-between items-center text-sm p-2 rounded-md border">
                         <div>
                          <p className="font-medium">Pedido a {pedido.proveedorNombre}</p>
                          <p className="text-xs text-muted-foreground">ID: {pedido.id}</p>
                        </div>
                        <Badge variant={pedido.estado === EstadoPedido.PENDIENTE ? 'secondary' : 'default'}>{pedido.estado}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay entregas programadas.</p>
                )}
              </div>
            </div>
            {(eventosDelDiaSeleccionado.vencimientos.length === 0 && eventosDelDiaSeleccionado.entregas.length === 0) && (
                 <p className="text-sm text-muted-foreground flex items-center justify-center h-full">No hay eventos para este día.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
