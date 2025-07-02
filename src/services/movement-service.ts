import { type MovimientoInventario } from '@/lib/types';

const globalForDb = globalThis as unknown as { movimientos: MovimientoInventario[] };
if (!globalForDb.movimientos) {
  globalForDb.movimientos = [];
}
const movimientos: MovimientoInventario[] = globalForDb.movimientos;

export async function logMovement(data: Omit<MovimientoInventario, 'id' | 'fecha'>): Promise<MovimientoInventario> {
  const nuevoMovimiento: MovimientoInventario = {
    ...data,
    id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    fecha: new Date(),
  };
  movimientos.unshift(nuevoMovimiento);
  console.log("Movimiento registrado:", nuevoMovimiento);
  return nuevoMovimiento;
}

export async function getMovementHistory(productoId: string): Promise<MovimientoInventario[]> {
  const historial = movimientos.filter(m => m.productoId === productoId);
  console.log(`Historial encontrado para ${productoId}: ${historial.length} movimientos.`);
  return JSON.parse(JSON.stringify(historial));
}
