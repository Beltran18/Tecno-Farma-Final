import { NextResponse } from 'next/server';
import { productosSimulados } from '@/lib/datos-simulados';

export async function GET() {
  // En una aplicación real, aquí es donde te conectarías a una base de datos.
  // Por ahora, simplemente devolvemos los datos simulados que ya tenemos.
  try {
    return NextResponse.json(productosSimulados);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
