import { type NextRequest, NextResponse } from 'next/server';
import { getAllDevoluciones, createDevolucion } from '@/services/devolucion-service';

export async function GET() {
  try {
    const devoluciones = await getAllDevoluciones();
    return NextResponse.json(devoluciones);
  } catch (error) {
    console.error('Error al obtener las devoluciones:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productoId, cantidadDevuelta, motivo } = await request.json();

    if (!productoId || !cantidadDevuelta || !motivo) {
       return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const nuevaDevolucion = await createDevolucion({ productoId, cantidadDevuelta, motivo });

    return NextResponse.json(nuevaDevolucion, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear la devolución:', error);
    return new NextResponse(JSON.stringify({ message: error.message || 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
