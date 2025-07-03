import { type NextRequest, NextResponse } from 'next/server';
import { registerProductExit } from '@/services/product-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { cantidad, notas } = await request.json();

    if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
      return NextResponse.json({ message: 'La cantidad es requerida y debe ser un número positivo.' }, { status: 400 });
    }

    const productoActualizado = await registerProductExit(params.id, cantidad, notas);

    if (!productoActualizado) {
      return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error('Error al registrar la salida del producto:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    const status = message === 'Stock insuficiente.' ? 409 : 500;
    return NextResponse.json({ message }, { status });
  }
}
