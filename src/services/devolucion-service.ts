import { type DevolucionProveedor, TipoMovimiento } from '@/lib/types';
import { getProductById, registerProductExit } from './product-service';

const globalForDb = globalThis as unknown as { devoluciones: DevolucionProveedor[] };
if (!globalForDb.devoluciones) {
  globalForDb.devoluciones = [];
}
let devoluciones: DevolucionProveedor[] = globalForDb.devoluciones;

export async function getAllDevoluciones(): Promise<DevolucionProveedor[]> {
  return JSON.parse(JSON.stringify(devoluciones));
}

export async function createDevolucion(data: {
  productoId: string;
  cantidadDevuelta: number;
  motivo: string;
}): Promise<DevolucionProveedor> {
  const producto = await getProductById(data.productoId);
  if (!producto) {
    throw new Error('Producto no encontrado.');
  }
  if (!producto.proveedorId || !producto.proveedorNombre) {
      throw new Error('El producto no tiene un proveedor asociado para la devolución.');
  }

  // Descontar del stock
  await registerProductExit(
    data.productoId,
    data.cantidadDevuelta,
    `Devolución: ${data.motivo}`,
    TipoMovimiento.DEVOLUCION_PROVEEDOR
  );

  const nuevaDevolucion: DevolucionProveedor = {
    id: `dev_${Date.now()}`,
    fecha: new Date(),
    productoId: data.productoId,
    productoNombre: producto.nombre,
    proveedorId: producto.proveedorId,
    proveedorNombre: producto.proveedorNombre,
    cantidadDevuelta: data.cantidadDevuelta,
    motivo: data.motivo,
  };

  devoluciones.unshift(nuevaDevolucion);
  return nuevaDevolucion;
}
