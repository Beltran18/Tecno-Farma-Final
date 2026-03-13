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
       return NextResponse.json({ message: 'Faltan campos requeridos' }, { status: 400 });
    }

    const nuevoKit = await createKit(kitData);

    return NextResponse.json(nuevoKit, { status: 201 });

  } catch (error) {
    console.error('Error al crear el kit:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ message }, { status: 500 });
  }
}
