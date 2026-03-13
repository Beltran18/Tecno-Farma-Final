import { type PedidoReposicion, EstadoPedido, TipoMovimiento } from '@/lib/types';
import { registerProductEntry } from './product-service';
import { getAllProveedores } from './proveedor-service';
import { getAllProducts } from './product-service';
import db from '@/lib/db';

function mapToPedido(row: any): PedidoReposicion {
    return {
        id: String(row.id),
        fechaPedido: new Date(row.fechapedido),
        fechaEntregaEstimada: row.fechaentregaestimada ? new Date(row.fechaentregaestimada) : undefined,
        proveedorId: String(row.proveedorid),
        proveedorNombre: row.proveedornombre,
        productos: JSON.parse(row.productos || '[]'),
        estado: row.estado,
    };
}

export async function getAllPedidos(): Promise<PedidoReposicion[]> {
  try {
    const result = await db.query('SELECT * FROM pedidos ORDER BY fechaPedido DESC');
    return (result.rows as any[]).map(mapToPedido);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return [];
  }
}

export async function createPedido(
  data: Omit<PedidoReposicion, 'id' | 'fechaPedido' | 'estado' | 'proveedorNombre' | 'productos'> & {
    productos: Omit<PedidoReposicion['productos'][0], 'productoNombre'>[]
  }
): Promise<PedidoReposicion> {
  const [proveedores, productos] = await Promise.all([
    getAllProveedores(),
    getAllProducts(),
  ]);
  
  const proveedor = proveedores.find(p => p.id === data.proveedorId);
  if (!proveedor) {
    throw new Error('Proveedor no encontrado.');
  }

  const productosMap = new Map(productos.map(p => [p.id, p.nombre]));

  const productosConNombre = data.productos.map(p => ({
    ...p,
    productoNombre: productosMap.get(String(p.productoId)) || 'Nombre no encontrado',
  }));

  const productosJson = JSON.stringify(productosConNombre);
  const sql = `
    INSERT INTO pedidos (proveedorid, proveedornombre, productos, estado, fechaentregaestimada) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *
  `;
  try {
    const insertResult = await db.query(sql, [
      data.proveedorId,
      proveedor.nombre,
      productosJson,
      EstadoPedido.PENDIENTE,
      data.fechaEntregaEstimada ? new Date(data.fechaEntregaEstimada) : null,
    ]);
    return mapToPedido(insertResult.rows[0]);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    throw new Error('No se pudo crear el pedido.');
  }
}

export async function updatePedidoStatus(id: string, estado: EstadoPedido): Promise<PedidoReposicion | null> {
  const select = await db.query('SELECT * FROM pedidos WHERE id = $1', [id]);
  if (select.rows.length === 0) {
    return null;
  }
  const pedido = mapToPedido(select.rows[0]);

  if (pedido.estado === estado) return pedido;

  if (estado === EstadoPedido.COMPLETADO) {
    if (pedido.estado !== EstadoPedido.ENVIADO) {
        throw new Error("Solo se pueden completar pedidos que ya han sido marcados como 'Enviado'.");
    }
    // Lógica para añadir stock (idealmente en una transacción)
    for (const item of pedido.productos) {
      await registerProductEntry(
        item.productoId,
        item.cantidadPedida,
        TipoMovimiento.ENTRADA_PEDIDO,
        `Recepción del pedido #${pedido.id}`
      );
    }
  }
  
  try {
    await db.query('UPDATE pedidos SET estado = $1 WHERE id = $2', [estado, id]);
    const updated = await db.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    return mapToPedido(updated.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar estado del pedido ${id}:`, error);
    throw new Error('No se pudo actualizar el estado del pedido.');
  }
}

export async function deletePedido(id: string): Promise<boolean> {
  try {
    const result = await db.query('DELETE FROM pedidos WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    throw new Error('No se pudo eliminar el pedido.');
  }
}
