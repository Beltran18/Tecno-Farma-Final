import { type NextRequest, NextResponse } from 'next/server';
import { getAllKits, createKit } from '@/services/kit-service';

export async function GET() {
  try {
    const kits = await getAllKits();
    return NextResponse.json(kits);
  } catch (error) {
    console.error('Error al obtener los kits:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const kitData = await request.json();

    if (!kitData.nombre || !kitData.precio || !kitData.componentes || kitData.componentes.length === 0) {
       return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const nuevoKit = await createKit(kitData);

    return NextResponse.json(nuevoKit, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear el kit:', error);
    return new NextResponse(JSON.stringify({ message: error.message || 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
