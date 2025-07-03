import { type MovimientoInventario } from '@/lib/types';
import db from '@/lib/db';

function mapToMovimiento(row: any): MovimientoInventario {
    return {
        id: String(row.id),
        productoId: String(row.productoId),
        productoNombre: row.productoNombre,
        numeroLote: row.numeroLote,
        fecha: new Date(row.fecha),
        tipo: row.tipo,
        cantidadMovida: row.cantidadMovida,
        stockAnterior: row.stockAnterior,
        stockNuevo: row.stockNuevo,
        notas: row.notas,
    };
}

export async function logMovement(data: Omit<MovimientoInventario, 'id' | 'fecha'>): Promise<MovimientoInventario> {
  const sql = `
    INSERT INTO movimientos_inventario 
    (productoId, productoNombre, numeroLote, tipo, cantidadMovida, stockAnterior, stockNuevo, notas) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await db.query(sql, [
        data.productoId,
        data.productoNombre,
        data.numeroLote,
        data.tipo,
        data.cantidadMovida,
        data.stockAnterior,
        data.stockNuevo,
        data.notas
    ]);
    const insertId = (result as any).insertId;
    
    const [newRow] = await db.query('SELECT * FROM movimientos_inventario WHERE id = ?', [insertId]);
    return mapToMovimiento((newRow as any[])[0]);

  } catch (error) {
    console.error("Error al registrar movimiento:", error);
    throw new Error('No se pudo registrar el movimiento en la base de datos.');
  }
}

export async function getMovementHistory(productoId: string): Promise<MovimientoInventario[]> {
  try {
    const [rows] = await db.query('SELECT * FROM movimientos_inventario WHERE productoId = ? ORDER BY fecha DESC', [productoId]);
    return (rows as any[]).map(mapToMovimiento);
  } catch (error) {
    console.error(`Error al obtener el historial para el producto ${productoId}:`, error);
    throw new Error('No se pudo obtener el historial del producto.');
  }
}

export async function getAllMovements(): Promise<MovimientoInventario[]> {
  try {
    const [rows] = await db.query('SELECT * FROM movimientos_inventario ORDER BY fecha DESC');
    return (rows as any[]).map(mapToMovimiento);
  } catch (error) {
    console.error('Error al obtener todos los movimientos:', error);
    throw new Error('No se pudieron obtener los movimientos.');
  }
}
