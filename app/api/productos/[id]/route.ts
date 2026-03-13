import { type NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/services/product-service';

// Obtener un solo producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const producto = await getProductById(params.id);
    if (!producto) {
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return NextResponse.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

// Actualizar un producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const datosActualizados = await request.json();
    const productoActualizado = await updateProduct(params.id, datosActualizados);

    if (!productoActualizado) {
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// Eliminar un producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fueEliminado = await deleteProduct(params.id);

    if (!fueEliminado) {
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new NextResponse(null, { status: 204 }); // Sin contenido, éxito
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
