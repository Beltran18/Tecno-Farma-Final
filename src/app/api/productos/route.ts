import { type NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/services/product-service';
import { type Producto } from '@/lib/types';

export async function GET() {
  try {
    const productos = await getAllProducts();
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const nuevoProductoData = await request.json();

    if (!nuevoProductoData.nombre || !nuevoProductoData.categoria || nuevoProductoData.precio === undefined || nuevoProductoData.cantidad === undefined || !nuevoProductoData.fechaVencimiento || !nuevoProductoData.numeroLote) {
       return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const nuevoProducto = await createProduct(nuevoProductoData);

    return NextResponse.json(nuevoProducto, { status: 201 });

  } catch (error) {
    console.error('Error al crear el producto:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
