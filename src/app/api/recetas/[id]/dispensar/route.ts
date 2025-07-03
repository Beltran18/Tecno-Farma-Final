import { type NextRequest, NextResponse } from 'next/server';
import { dispenseReceta } from '@/services/receta-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recetaDispensada = await dispenseReceta(params.id);
    return NextResponse.json(recetaDispensada);
  } catch (error: any) {
    console.error(`Error al dispensar la receta ${params.id}:`, error);
    const status = error.message.includes('insuficiente') ? 409 : 
                   error.message.includes('encontrada') ? 404 : 500;
    return new NextResponse(JSON.stringify({ message: error.message || 'Error interno del servidor' }), { status, headers: { 'Content-Type': 'application/json' } });
  }
}
