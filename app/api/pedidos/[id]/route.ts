import { type NextRequest, NextResponse } from 'next/server';
import { updatePedidoStatus, deletePedido } from '@/services/pedido-service';
import { EstadoPedido } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { estado } = await request.json();

    if (!estado || !Object.values(EstadoPedido).includes(estado)) {
      return NextResponse.json({ message: 'Estado no válido' }, { status: 400 });
    }

    const pedidoActualizado = await updatePedidoStatus(params.id, estado);

    if (!pedidoActualizado) {
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

    return NextResponse.json(pedidoActualizado);
  } catch (error) {
    console.error(`Error al actualizar el estado del pedido ${params.id}:`, error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ message }, { status: 500 });
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fueEliminado = await deletePedido(params.id);

    if (!fueEliminado) {
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error al eliminar el pedido ${params.id}:`, error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ message }, { status: 500 });
  }
}
