import { type NextRequest, NextResponse } from 'next/server';
import { productosSimulados } from '@/lib/datos-simulados';
import { type Producto } from '@/lib/types';

// Obtener un solo producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const producto = productosSimulados.find(p => p.id === params.id);
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
    const indiceProducto = productosSimulados.findIndex(p => p.id === params.id);

    if (indiceProducto === -1) {
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Asegurarse de que la fecha siga siendo un objeto Date
    const productoActualizado: Producto = {
        ...productosSimulados[indiceProducto],
        ...datosActualizados,
        fechaVencimiento: new Date(datosActualizados.fechaVencimiento),
    };

    productosSimulados[indiceProducto] = productoActualizado;

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
    const indiceProducto = productosSimulados.findIndex(p => p.id === params.id);

    if (indiceProducto === -1) {
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    productosSimulados.splice(indiceProducto, 1);

    return new NextResponse(null, { status: 204 }); // Sin contenido, éxito
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
