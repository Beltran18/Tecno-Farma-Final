import { type MovimientoInventario } from '@/lib/types';
import db from '@/lib/db';

function mapToMovimiento(row: any): MovimientoInventario {
    return {
        id: String(row.id),
        productoId: String(row.productoid),
        productoNombre: row.productonombre,
        numeroLote: row.numerolote,
        fecha: new Date(row.fecha),
        tipo: row.tipo,
        cantidadMovida: row.cantidadmovida,
        stockAnterior: row.stockanterior,
        stockNuevo: row.stocknuevo,
        notas: row.notas,
    };
}

export async function logMovement(data: Omit<MovimientoInventario, 'id' | 'fecha'>): Promise<MovimientoInventario> {
  const sql = `
    INSERT INTO movimientos_inventario 
    (productoid, productonombre, numerolote, tipo, cantidadmovida, stockanterior, stocknuevo, notas) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  try {
    const insertResult = await db.query(sql, [
        data.productoId,
        data.productoNombre,
        data.numeroLote,
        data.tipo,
        data.cantidadMovida,
        data.stockAnterior,
        data.stockNuevo,
        data.notas
    ]);
    return mapToMovimiento(insertResult.rows[0]);

  } catch (error) {
    console.error("Error al registrar movimiento:", error);
    throw new Error('No se pudo registrar el movimiento en la base de datos.');
  }
}

export async function getMovementHistory(productoId: string): Promise<MovimientoInventario[]> {
  try {
    const result = await db.query('SELECT * FROM movimientos_inventario WHERE productoid = $1 ORDER BY fecha DESC', [productoId]);
    return (result.rows as any[]).map(mapToMovimiento);
  } catch (error) {
    console.error(`Error al obtener el historial para el producto ${productoId}:`, error);
    throw new Error('No se pudo obtener el historial del producto.');
  }
}

export async function getAllMovements(): Promise<MovimientoInventario[]> {
  try {
    const result = await db.query('SELECT * FROM movimientos_inventario ORDER BY fecha DESC');
    return (result.rows as any[]).map(mapToMovimiento);
  } catch (error) {
    console.error('Error al obtener todos los movimientos:', error);
    return [];
  }
}
