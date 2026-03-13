import { type NextRequest, NextResponse } from 'next/server';
import { getMovementHistory } from '@/services/movement-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { productoId: string } }
) {
  try {
    const historial = await getMovementHistory(params.productoId);
    return NextResponse.json(historial);
  } catch (error) {
    console.error(`Error al obtener el historial para el producto ${params.productoId}:`, error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
