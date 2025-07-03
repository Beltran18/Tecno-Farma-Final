import { type NextRequest, NextResponse } from 'next/server';
import { updatePedidoStatus } from '@/services/pedido-service';
import { EstadoPedido } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { estado } = await request.json();

    if (!estado || !Object.values(EstadoPedido).includes(estado)) {
      return new NextResponse(JSON.stringify({ message: 'Estado no válido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const pedidoActualizado = await updatePedidoStatus(params.id, estado);

    if (!pedidoActualizado) {
      return new NextResponse(JSON.stringify({ message: 'Pedido no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return NextResponse.json(pedidoActualizado);
  } catch (error: any) {
    console.error(`Error al actualizar el estado del pedido ${params.id}:`, error);
    return new NextResponse(JSON.stringify({ message: error.message || 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
