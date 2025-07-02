import { type NextRequest, NextResponse } from 'next/server';
import { registerProductExit } from '@/services/product-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { cantidad, notas } = await request.json();

    if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
      return new NextResponse(JSON.stringify({ message: 'La cantidad es requerida y debe ser un número positivo.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const productoActualizado = await registerProductExit(params.id, cantidad, notas);

    if (!productoActualizado) {
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return NextResponse.json(productoActualizado);
  } catch (error: any) {
    console.error('Error al registrar la salida del producto:', error);
    const status = error.message === 'Stock insuficiente.' ? 409 : 500;
    return new NextResponse(JSON.stringify({ message: error.message || 'Error interno del servidor' }), { status, headers: { 'Content-Type': 'application/json' } });
  }
}
