import { type NextRequest, NextResponse } from 'next/server';
import { deleteDevolucion } from '@/services/devolucion-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fueEliminado = await deleteDevolucion(params.id);

    if (!fueEliminado) {
      return new NextResponse(JSON.stringify({ message: 'Devolución no encontrada' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar la devolución:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
