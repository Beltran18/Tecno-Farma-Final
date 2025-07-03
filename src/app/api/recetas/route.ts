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
       return new NextResponse(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const nuevaReceta = await createReceta(recetaData);

    return NextResponse.json(nuevaReceta, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear la receta:', error);
    return new NextResponse(JSON.stringify({ message: error.message || 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
