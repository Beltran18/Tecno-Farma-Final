import { type DevolucionProveedor, TipoMovimiento } from '@/lib/types';
import { getProductById, registerProductExit } from './product-service';
import db from '@/lib/db';

function mapToDevolucion(row: any): DevolucionProveedor {
    return {
        id: String(row.id),
        fecha: new Date(row.fecha),
        productoId: String(row.productoid),
        productoNombre: row.productonombre,
        proveedorId: String(row.proveedorid),
        proveedorNombre: row.proveedornombre,
        cantidadDevuelta: row.cantidaddevuelta,
        motivo: row.motivo,
    };
}

export async function getAllDevoluciones(): Promise<DevolucionProveedor[]> {
  try {
    const result = await db.query('SELECT * FROM devoluciones ORDER BY fecha DESC');
    return (result.rows as any[]).map(mapToDevolucion);
  } catch (error) {
    console.error('Error al obtener las devoluciones:', error);
    return [];
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

  const sql = `INSERT INTO devoluciones (productoid, productonombre, proveedorid, proveedornombre, cantidaddevuelta, motivo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  
  try {
    const insertResult = await db.query(sql, [
      data.productoId,
      producto.nombre,
      producto.proveedorId,
      producto.proveedorNombre,
      data.cantidadDevuelta,
      data.motivo,
    ]);
    // PostgreSQL RETURNING gives new row directly
    return mapToDevolucion(insertResult.rows[0]);
  } catch (error) {
    console.error('Error al crear la devolución en DB:', error);
    // Aquí se debería implementar lógica para revertir la salida de stock si la inserción de la devolución falla.
    // Por simplicidad del prototipo, se omite.
    throw new Error('No se pudo registrar la devolución.');
  }
}

export async function deleteDevolucion(id: string): Promise<boolean> {
  try {
    const result = await db.query('DELETE FROM devoluciones WHERE id = $1', [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error al eliminar la devolución:', error);
    throw new Error('No se pudo eliminar la devolución.');
  }
}
