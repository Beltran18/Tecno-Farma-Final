import { type NextRequest, NextResponse } from 'next/server';
import { sellKit } from '@/services/kit-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { cantidad } = await request.json();

    if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
      return NextResponse.json({ message: 'La cantidad es requerida y debe ser un número positivo.' }, { status: 400 });
    }
    
    await sellKit(params.id, cantidad);

    return NextResponse.json({ message: `Venta de ${cantidad} kit(s) registrada exitosamente.` });

  } catch (error) {
    console.error('Error al registrar la venta del kit:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    const status = message.includes('insuficiente') ? 409 : 
                   message.includes('encontrado') ? 404 : 500;
    return NextResponse.json({ message }, { status });
  }
}
