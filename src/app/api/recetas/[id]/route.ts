import { type NextRequest, NextResponse } from 'next/server';
import { deleteReceta } from '@/services/receta-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fueEliminado = await deleteReceta(params.id);

    if (!fueEliminado) {
      return new NextResponse(JSON.stringify({ message: 'Receta no encontrada' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar la receta:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
