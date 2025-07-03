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
    const [rows] = await db.query('SELECT * FROM proveedores ORDER BY nombre ASC');
    return (rows as any[]).map(mapToProveedor);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw new Error('No se pudieron obtener los proveedores.');
  }
}

export async function createProveedor(proveedorData: Omit<Proveedor, 'id'>): Promise<Proveedor> {
    try {
        const sql = 'INSERT INTO proveedores (nombre, contacto, telefono) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [proveedorData.nombre, proveedorData.contacto, proveedorData.telefono]);
        const insertId = (result as any).insertId;
        
        const [newRow] = await db.query('SELECT * FROM proveedores WHERE id = ?', [insertId]);
        return mapToProveedor((newRow as any)[0]);
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('El proveedor ya existe.');
        }
        console.error('Error al crear proveedor:', error);
        throw new Error('No se pudo crear el proveedor.');
    }
}

export async function updateProveedor(id: string, proveedorData: Partial<Omit<Proveedor, 'id'>>): Promise<Proveedor | null> {
  try {
    const [rows] = await db.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) {
        return null;
    }

    await db.query('UPDATE proveedores SET ? WHERE id = ?', [proveedorData, id]);
    
    const [updatedRows] = await db.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    return mapToProveedor((updatedRows as any)[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Ya existe otro proveedor con ese nombre.');
    }
    console.error('Error al actualizar proveedor:', error);
    throw new Error('No se pudo actualizar el proveedor.');
  }
}

export async function deleteProveedor(id: string): Promise<boolean> {
    try {
        const [result] = await db.query('DELETE FROM proveedores WHERE id = ?', [id]);
        return (result as any).affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        // Si hay productos asociados, la BD puede lanzar un error de FK
        if ((error as any).code === 'ER_ROW_IS_REFERENCED_2') {
            throw new Error('No se puede eliminar el proveedor porque tiene productos asociados.');
        }
        throw new Error('No se pudo eliminar el proveedor.');
    }
}
