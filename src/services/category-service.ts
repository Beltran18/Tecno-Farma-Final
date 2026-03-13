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
    const result = await db.query('SELECT * FROM categorias ORDER BY nombre ASC');
    return (result.rows as any[]).map(mapToCategoria);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return [];
  }
}

export async function createCategory(nombre: string): Promise<Categoria> {
  try {
    const insertResult = await db.query(
      'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    return mapToCategoria(insertResult.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') { // unique_violation
      throw new Error('La categoría ya existe.');
    }
    console.error('Error al crear la categoría:', error);
    throw new Error('No se pudo crear la categoría.');
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const result = await db.query('DELETE FROM categorias WHERE id = $1', [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    throw new Error('No se pudo eliminar la categoría.');
  }
}
