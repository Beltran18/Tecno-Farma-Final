import { type DevolucionProveedor, TipoMovimiento } from '@/lib/types';
import { getProductById, registerProductExit } from './product-service';
import db from '@/lib/db';

function mapToDevolucion(row: any): DevolucionProveedor {
    return {
        id: String(row.id),
        fecha: new Date(row.fecha),
        productoId: String(row.productoId),
        productoNombre: row.productoNombre,
        proveedorId: String(row.proveedorId),
        proveedorNombre: row.proveedorNombre,
        cantidadDevuelta: row.cantidadDevuelta,
        motivo: row.motivo,
    };
}

export async function getAllDevoluciones(): Promise<DevolucionProveedor[]> {
  try {
    const [rows] = await db.query('SELECT * FROM devoluciones ORDER BY fecha DESC');
    return (rows as any[]).map(mapToDevolucion);
  } catch (error) {
    console.error('Error al obtener las devoluciones:', error);
    throw new Error('No se pudieron obtener las devoluciones.');
  }
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

  // Descontar del stock y registrar movimiento
  await registerProductExit(
    data.productoId,
    data.cantidadDevuelta,
    `Devolución: ${data.motivo}`,
    TipoMovimiento.DEVOLUCION_PROVEEDOR
  );

  const sql = `INSERT INTO devoluciones (productoId, productoNombre, proveedorId, proveedorNombre, cantidadDevuelta, motivo) VALUES (?, ?, ?, ?, ?, ?)`;
  
  try {
    const [result] = await db.query(sql, [
      data.productoId,
      producto.nombre,
      producto.proveedorId,
      producto.proveedorNombre,
      data.cantidadDevuelta,
      data.motivo,
    ]);
    const insertId = (result as any).insertId;
    const [newRow] = await db.query('SELECT * FROM devoluciones WHERE id = ?', [insertId]);
    return mapToDevolucion((newRow as any)[0]);
  } catch (error) {
    console.error('Error al crear la devolución en DB:', error);
    // Aquí se debería implementar lógica para revertir la salida de stock si la inserción de la devolución falla.
    // Por simplicidad del prototipo, se omite.
    throw new Error('No se pudo registrar la devolución.');
  }
}

export async function deleteDevolucion(id: string): Promise<boolean> {
  try {
    const [result] = await db.query('DELETE FROM devoluciones WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('Error al eliminar la devolución:', error);
    throw new Error('No se pudo eliminar la devolución.');
  }
}
