import { type NextRequest, NextResponse } from 'next/server';
import { dispenseReceta } from '@/services/receta-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recetaDispensada = await dispenseReceta(params.id);
    return NextResponse.json(recetaDispensada);
  } catch (error) {
    console.error(`Error al dispensar la receta ${params.id}:`, error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    const status = message.includes('insuficiente') ? 409 : 
                   message.includes('encontrada') ? 404 : 500;
    return NextResponse.json({ message }, { status });
  }
}
