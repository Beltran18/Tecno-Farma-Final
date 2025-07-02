import { type NextRequest, NextResponse } from 'next/server';
import { deleteCategory } from '@/services/category-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fueEliminado = await deleteCategory(params.id);

    if (!fueEliminado) {
      return new NextResponse(JSON.stringify({ message: 'Categoría no encontrada' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
