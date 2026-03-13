import { type NextRequest, NextResponse } from 'next/server';
import { getAllPedidos, createPedido } from '@/services/pedido-service';

export async function GET() {
  try {
    const pedidos = await getAllPedidos();
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const pedidoData = await request.json();

    if (!pedidoData.proveedorId || !pedidoData.productos || pedidoData.productos.length === 0) {
       return NextResponse.json({ message: 'Faltan campos requeridos' }, { status: 400 });
    }

    const nuevoPedido = await createPedido(pedidoData);

    return NextResponse.json(nuevoPedido, { status: 201 });

  } catch (error) {
    console.error('Error al crear el pedido:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ message }, { status: 500 });
  }
}
