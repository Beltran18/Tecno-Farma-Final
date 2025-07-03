import { type NextRequest, NextResponse } from 'next/server';
import { getAllRecetas, createReceta } from '@/services/receta-service';

export async function GET() {
  try {
    const recetas = await getAllRecetas();
    return NextResponse.json(recetas);
  } catch (error) {
    console.error('Error al obtener las recetas:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const recetaData = await request.json();

    if (!recetaData.pacienteNombre || !recetaData.doctorNombre || !recetaData.fechaPrescripcion || !recetaData.medicamentos || recetaData.medicamentos.length === 0) {
       return NextResponse.json({ message: 'Faltan campos requeridos' }, { status: 400 });
    }

    const nuevaReceta = await createReceta(recetaData);

    return NextResponse.json(nuevaReceta, { status: 201 });

  } catch (error) {
    console.error('Error al crear la receta:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ message }, { status: 500 });
  }
}
