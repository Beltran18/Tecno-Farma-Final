import { type PedidoReposicion, EstadoPedido, TipoMovimiento } from '@/lib/types';
import { registerProductEntry } from './product-service';
import { getAllProveedores } from './proveedor-service';
import { getAllProducts } from './product-service';

const globalForDb = globalThis as unknown as { pedidos: PedidoReposicion[] };
if (!globalForDb.pedidos) {
  globalForDb.pedidos = [];
}
let pedidos: PedidoReposicion[] = globalForDb.pedidos;

export async function getAllPedidos(): Promise<PedidoReposicion[]> {
  return JSON.parse(JSON.stringify(pedidos));
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

  const nuevoPedido: PedidoReposicion = {
    id: `ped_${Date.now()}`,
    fechaPedido: new Date(),
    fechaEntregaEstimada: data.fechaEntregaEstimada ? new Date(data.fechaEntregaEstimada) : undefined,
    proveedorId: data.proveedorId,
    proveedorNombre: proveedor.nombre,
    productos: data.productos.map(p => ({
        ...p,
        productoNombre: productosMap.get(p.productoId) || 'Nombre no encontrado',
    })),
    estado: EstadoPedido.PENDIENTE,
  };

  pedidos.unshift(nuevoPedido);
  return nuevoPedido;
}

export async function updatePedidoStatus(id: string, estado: EstadoPedido): Promise<PedidoReposicion | null> {
  const index = pedidos.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }

  const pedido = pedidos[index];
  if (pedido.estado === estado) return pedido;

  if (estado === EstadoPedido.COMPLETADO) {
    if (pedido.estado !== EstadoPedido.PENDIENTE) {
        throw new Error('Solo se pueden completar pedidos pendientes.');
    }
    // Lógica para añadir stock
    for (const item of pedido.productos) {
      await registerProductEntry(
        item.productoId,
        item.cantidadPedida,
        TipoMovimiento.ENTRADA_PEDIDO,
        `Recepción del pedido ${pedido.id}`
      );
    }
  }

  const pedidoActualizado = { ...pedido, estado };
  pedidos[index] = pedidoActualizado;
  return pedidoActualizado;
}

export async function deletePedido(id: string): Promise<boolean> {
  const pedidoIndex = pedidos.findIndex(p => p.id === id);
  if (pedidoIndex === -1) {
    return false;
  }
  const pedido = pedidos[pedidoIndex];
  if (pedido.estado === EstadoPedido.PENDIENTE) {
    // Optionally, prevent deletion of pending orders. For now, we allow it.
    // throw new Error('No se pueden eliminar pedidos pendientes. Primero debes cancelarlo.');
  }
  pedidos.splice(pedidoIndex, 1);
  return true;
}
