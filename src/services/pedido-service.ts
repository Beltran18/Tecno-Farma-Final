import { type PedidoReposicion, EstadoPedido, TipoMovimiento } from '@/lib/types';
import { registerProductEntry } from './product-service';
import { getAllProveedores } from './proveedor-service';
import { getAllProducts } from './product-service';
import db from '@/lib/db';

function mapToPedido(row: any): PedidoReposicion {
    return {
        id: String(row.id),
        fechaPedido: new Date(row.fechaPedido),
        fechaEntregaEstimada: row.fechaEntregaEstimada ? new Date(row.fechaEntregaEstimada) : undefined,
        proveedorId: String(row.proveedorId),
        proveedorNombre: row.proveedorNombre,
        productos: JSON.parse(row.productos || '[]'),
        estado: row.estado,
    };
}

export async function getAllPedidos(): Promise<PedidoReposicion[]> {
  try {
    const [rows] = await db.query('SELECT * FROM pedidos ORDER BY fechaPedido DESC');
    return (rows as any[]).map(mapToPedido);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    throw new Error('No se pudieron obtener los pedidos.');
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
    INSERT INTO pedidos (proveedorId, proveedorNombre, productos, estado, fechaEntregaEstimada) 
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await db.query(sql, [
      data.proveedorId,
      proveedor.nombre,
      productosJson,
      EstadoPedido.PENDIENTE,
      data.fechaEntregaEstimada ? new Date(data.fechaEntregaEstimada) : null,
    ]);
    const insertId = (result as any).insertId;
    const [newRow] = await db.query('SELECT * FROM pedidos WHERE id = ?', [insertId]);
    return mapToPedido((newRow as any)[0]);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    throw new Error('No se pudo crear el pedido.');
  }
}

export async function updatePedidoStatus(id: string, estado: EstadoPedido): Promise<PedidoReposicion | null> {
  const [rows] = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);
  if ((rows as any[]).length === 0) {
    return null;
  }
  const pedido = mapToPedido((rows as any)[0]);

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
    await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    const [updatedRows] = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);
    return mapToPedido((updatedRows as any)[0]);
  } catch (error) {
    console.error(`Error al actualizar estado del pedido ${id}:`, error);
    throw new Error('No se pudo actualizar el estado del pedido.');
  }
}

export async function deletePedido(id: string): Promise<boolean> {
  try {
    const [result] = await db.query('DELETE FROM pedidos WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    throw new Error('No se pudo eliminar el pedido.');
  }
}
