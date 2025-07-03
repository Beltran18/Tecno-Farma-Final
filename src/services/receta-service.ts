import { type RecetaMedica, type MedicamentoPrescrito, TipoMovimiento } from '@/lib/types';
import { getProductById, registerProductExit } from './product-service';
import db from '@/lib/db';

function mapToReceta(row: any): RecetaMedica {
    return {
        id: String(row.id),
        pacienteNombre: row.pacienteNombre,
        doctorNombre: row.doctorNombre,
        fechaPrescripcion: new Date(row.fechaPrescripcion),
        medicamentos: JSON.parse(row.medicamentos || '[]'),
        estado: row.estado,
    };
}

export async function getAllRecetas(): Promise<RecetaMedica[]> {
  try {
    const [rows] = await db.query('SELECT * FROM recetas ORDER BY fechaPrescripcion DESC');
    return (rows as any[]).map(mapToReceta);
  } catch (error) {
    console.error('Error al obtener recetas:', error);
    throw new Error('No se pudieron obtener las recetas.');
  }
}

export async function createReceta(
  data: Omit<RecetaMedica, 'id' | 'estado' | 'medicamentos'> & { medicamentos: Omit<MedicamentoPrescrito, 'productoNombre' | 'notas'>[] }
): Promise<RecetaMedica> {
  
  const medicamentosCompletos: MedicamentoPrescrito[] = await Promise.all(
    data.medicamentos.map(async (med) => {
      const producto = await getProductById(med.productoId);
      if (!producto) {
        throw new Error(`Producto con ID ${med.productoId} no encontrado.`);
      }
      return {
        ...med,
        productoNombre: producto.nombre,
      };
    })
  );

  const medicamentosJson = JSON.stringify(medicamentosCompletos);
  const sql = `
    INSERT INTO recetas (pacienteNombre, doctorNombre, fechaPrescripcion, medicamentos, estado) 
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [
      data.pacienteNombre,
      data.doctorNombre,
      new Date(data.fechaPrescripcion),
      medicamentosJson,
      'Pendiente'
    ]);
    const insertId = (result as any).insertId;
    const [newRow] = await db.query('SELECT * FROM recetas WHERE id = ?', [insertId]);
    return mapToReceta((newRow as any)[0]);
  } catch (error) {
    console.error('Error al crear receta:', error);
    throw new Error('No se pudo crear la receta.');
  }
}


export async function dispenseReceta(recetaId: string): Promise<RecetaMedica> {
  const [rows] = await db.query('SELECT * FROM recetas WHERE id = ?', [recetaId]);
  if ((rows as any[]).length === 0) {
    throw new Error('Receta no encontrada.');
  }

  const receta = mapToReceta((rows as any)[0]);

  if (receta.estado !== 'Pendiente') {
    throw new Error(`No se puede dispensar una receta que está en estado "${receta.estado}".`);
  }

  // 1. Verificar stock ANTES de dispensar nada (idealmente en una transacción)
  for (const med of receta.medicamentos) {
    const producto = await getProductById(med.productoId);
    if (!producto || producto.cantidad < med.cantidadPrescrita) {
      throw new Error(`Stock insuficiente para "${med.productoNombre}". Se necesitan ${med.cantidadPrescrita} y hay ${producto?.cantidad || 0}.`);
    }
  }

  // 2. Si hay stock para todo, proceder a descontar
  for (const med of receta.medicamentos) {
    await registerProductExit(
      med.productoId,
      med.cantidadPrescrita,
      `Dispensado por receta #${receta.id} para ${receta.pacienteNombre}`,
      TipoMovimiento.DISPENSADO_RECETA
    );
  }

  // 3. Actualizar el estado de la receta
  try {
    await db.query('UPDATE recetas SET estado = ? WHERE id = ?', ['Dispensada', recetaId]);
    const [updatedRows] = await db.query('SELECT * FROM recetas WHERE id = ?', [recetaId]);
    return mapToReceta((updatedRows as any)[0]);
  } catch (error) {
    console.error('Error al actualizar estado de la receta:', error);
    throw new Error('No se pudo actualizar el estado de la receta.');
  }
}

export async function deleteReceta(id: string): Promise<boolean> {
    try {
        const [result] = await db.query('DELETE FROM recetas WHERE id = ?', [id]);
        return (result as any).affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar receta:', error);
        throw new Error('No se pudo eliminar la receta.');
    }
}
