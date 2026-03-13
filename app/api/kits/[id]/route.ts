import { type NextRequest, NextResponse } from 'next/server';
import { deleteKit } from '@/services/kit-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fueEliminado = await deleteKit(params.id);

    if (!fueEliminado) {
      return new NextResponse(JSON.stringify({ message: 'Kit no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar el kit:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
