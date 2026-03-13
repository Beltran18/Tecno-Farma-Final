import { type Proveedor } from '@/lib/types';
import db from '@/lib/db';

function mapToProveedor(row: any): Proveedor {
    return {
        id: String(row.id),
        nombre: row.nombre,
        contacto: row.contacto,
        telefono: row.telefono,
    };
}

export async function getAllProveedores(): Promise<Proveedor[]> {
  try {
    const result = await db.query('SELECT * FROM proveedores ORDER BY nombre ASC');
    return (result.rows as any[]).map(mapToProveedor);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return [];
  }
}

export async function createProveedor(proveedorData: Omit<Proveedor, 'id'>): Promise<Proveedor> {
    try {
        const sql = 'INSERT INTO proveedores (nombre, contacto, telefono) VALUES ($1, $2, $3) RETURNING *';
        const insertResult = await db.query(sql, [proveedorData.nombre, proveedorData.contacto, proveedorData.telefono]);
        return mapToProveedor(insertResult.rows[0]);
    } catch (error: any) {
        if (error.code === '23505') {
            throw new Error('El proveedor ya existe.');
        }
        console.error('Error al crear proveedor:', error);
        throw new Error('No se pudo crear el proveedor.');
    }
}

export async function updateProveedor(id: string, proveedorData: Partial<Omit<Proveedor, 'id'>>): Promise<Proveedor | null> {
  try {
    const select = await db.query('SELECT * FROM proveedores WHERE id = $1', [id]);
    if (select.rows.length === 0) {
        return null;
    }

    const fields = Object.keys(proveedorData);
    if (fields.length > 0) {
        const sets = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        await db.query(`UPDATE proveedores SET ${sets} WHERE id = $${fields.length + 1}`, [...fields.map(k => (proveedorData as any)[k]), id]);
    }
    
    const updated = await db.query('SELECT * FROM proveedores WHERE id = $1', [id]);
    return mapToProveedor(updated.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
        throw new Error('Ya existe otro proveedor con ese nombre.');
    }
    console.error('Error al actualizar proveedor:', error);
    throw new Error('No se pudo actualizar el proveedor.');
  }
}

export async function deleteProveedor(id: string): Promise<boolean> {
    try {
        const result = await db.query('DELETE FROM proveedores WHERE id = $1', [id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        // Si hay productos asociados, la BD puede lanzar un error de FK
        if ((error as any).code === '23503') {
            throw new Error('No se puede eliminar el proveedor porque tiene productos asociados.');
        }
        throw new Error('No se pudo eliminar el proveedor.');
    }
}
