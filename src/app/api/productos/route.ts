import { type NextRequest, NextResponse } from 'next/server';
import { productosSimulados } from '@/lib/datos-simulados';
import { type Producto } from '@/lib/types';

export async function GET() {
  try {
    // Devolvemos una copia para no mutar el array original directamente
    const productos = [...productosSimulados];
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const nuevoProductoData = await request.json();

    // Validación básica (en una app real, usar Zod o similar)
    if (!nuevoProductoData.nombre || !nuevoProductoData.categoria || nuevoProductoData.precio === undefined || nuevoProductoData.cantidad === undefined || !nuevoProductoData.fechaVencimiento || !nuevoProductoData.numeroLote) {
       return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const nuevoProducto: Producto = {
      ...nuevoProductoData,
      id: `prod_${Date.now()}`, // El servidor genera el ID
      fechaVencimiento: new Date(nuevoProductoData.fechaVencimiento), // Asegurarse de que sea un objeto Date
    };

    // Nota: Esto modifica el array en memoria.
    // Los cambios no persistirán si el servidor se reinicia.
    productosSimulados.push(nuevoProducto);

    return NextResponse.json(nuevoProducto, { status: 201 });

  } catch (error) {
    console.error('Error al crear el producto:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
