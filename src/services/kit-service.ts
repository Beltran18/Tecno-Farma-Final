import { type Kit, type ProductoComponente, TipoMovimiento } from '@/lib/types';
import { getProductById, registerProductExit } from './product-service';
import db from '@/lib/db';

function mapToKit(row: any): Kit {
    return {
        id: String(row.id),
        nombre: row.nombre,
        precio: parseFloat(row.precio),
        componentes: JSON.parse(row.componentes || '[]'),
    };
}

export async function getAllKits(): Promise<Kit[]> {
  try {
    const result = await db.query('SELECT * FROM kits ORDER BY nombre ASC');
    return (result.rows as any[]).map(mapToKit);
  } catch (error) {
    console.error('Error al obtener kits:', error);
    return [];
  }
}

export async function createKit(data: Omit<Kit, 'id' | 'componentes'> & { componentes: Omit<ProductoComponente, 'productoNombre'>[] }): Promise<Kit> {
  // Enriquecer componentes con el nombre del producto
  const componentesCompletos: ProductoComponente[] = await Promise.all(
    data.componentes.map(async (comp) => {
      const producto = await getProductById(comp.productoId);
      if (!producto) {
        throw new Error(`El producto componente con ID ${comp.productoId} no fue encontrado.`);
      }
      return { ...comp, productoNombre: producto.nombre };
    })
  );

  const componentesJson = JSON.stringify(componentesCompletos);
  const sql = 'INSERT INTO kits (nombre, precio, componentes) VALUES ($1, $2, $3) RETURNING *';

  try {
    const insertResult = await db.query(sql, [data.nombre, data.precio, componentesJson]);
    return mapToKit(insertResult.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      throw new Error('Ya existe un kit con este nombre.');
    }
    console.error('Error al crear el kit:', error);
    throw new Error('No se pudo crear el kit.');
  }
}

export async function deleteKit(id: string): Promise<boolean> {
  try {
    const result = await db.query('DELETE FROM kits WHERE id = $1', [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error al eliminar el kit:', error);
    throw new Error('No se pudo eliminar el kit.');
  }
}

export async function sellKit(kitId: string, cantidadVendida: number): Promise<void> {
  const selectResult = await db.query('SELECT * FROM kits WHERE id = $1', [kitId]);
  if (selectResult.rows.length === 0) {
    throw new Error('Kit no encontrado.');
  }
  const kit = mapToKit(selectResult.rows[0]);

  // 1. Verificar stock de todos los componentes ANTES de descontar
  for (const componente of kit.componentes) {
    const producto = await getProductById(componente.productoId);
    const cantidadRequerida = componente.cantidad * cantidadVendida;
    if (!producto || producto.cantidad < cantidadRequerida) {
      throw new Error(`Stock insuficiente para "${componente.productoNombre}". Se necesitan ${cantidadRequerida} y hay ${producto?.cantidad || 0}.`);
    }
  }

  // 2. Si hay stock para todo, proceder a descontar
  // Esto debería estar en una transacción en una app real
  for (const componente of kit.componentes) {
    await registerProductExit(
      componente.productoId,
      componente.cantidad * cantidadVendida,
      `Venta del kit "${kit.nombre}"`,
      TipoMovimiento.VENTA_KIT
    );
  }
}
