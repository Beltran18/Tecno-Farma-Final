import { type Categoria } from '@/lib/types';
import db from '@/lib/db';

function mapToCategoria(row: any): Categoria {
  return {
    id: String(row.id),
    nombre: row.nombre,
  };
}

export async function getAllCategories(): Promise<Categoria[]> {
  try {
    const [rows] = await db.query('SELECT * FROM categorias ORDER BY nombre ASC');
    return (rows as any[]).map(mapToCategoria);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    throw new Error('No se pudo obtener las categorías de la base de datos.');
  }
}

export async function createCategory(nombre: string): Promise<Categoria> {
  try {
    const [result] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
    const insertId = (result as any).insertId;
    const [newRow] = await db.query('SELECT * FROM categorias WHERE id = ?', [insertId]);
    return mapToCategoria((newRow as any)[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('La categoría ya existe.');
    }
    console.error('Error al crear la categoría:', error);
    throw new Error('No se pudo crear la categoría.');
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    throw new Error('No se pudo eliminar la categoría.');
  }
}
