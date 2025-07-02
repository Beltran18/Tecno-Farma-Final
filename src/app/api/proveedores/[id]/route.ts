import { type NextRequest, NextResponse } from 'next/server';
import { updateProveedor, deleteProveedor } from '@/services/proveedor-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const datosActualizados = await request.json();
    const proveedorActualizado = await updateProveedor(params.id, datosActualizados);

    if (!proveedorActualizado) {
      return new NextResponse(JSON.stringify({ message: 'Proveedor no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return NextResponse.json(proveedorActualizado);
  } catch (error) {
    console.error('Error al actualizar el proveedor:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fueEliminado = await deleteProveedor(params.id);

    if (!fueEliminado) {
      return new NextResponse(JSON.stringify({ message: 'Proveedor no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar el proveedor:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
