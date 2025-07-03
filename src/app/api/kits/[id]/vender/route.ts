import { type NextRequest, NextResponse } from 'next/server';
import { sellKit } from '@/services/kit-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { cantidad } = await request.json();

    if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
      return new NextResponse(JSON.stringify({ message: 'La cantidad es requerida y debe ser un número positivo.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    await sellKit(params.id, cantidad);

    return NextResponse.json({ message: `Venta de ${cantidad} kit(s) registrada exitosamente.` });

  } catch (error: any) {
    console.error('Error al registrar la venta del kit:', error);
    const status = error.message.includes('insuficiente') ? 409 : 
                   error.message.includes('encontrado') ? 404 : 500;
    return new NextResponse(JSON.stringify({ message: error.message || 'Error interno del servidor' }), { status, headers: { 'Content-Type': 'application/json' } });
  }
}
