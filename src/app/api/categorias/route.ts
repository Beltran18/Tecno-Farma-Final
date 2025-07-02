import { type NextRequest, NextResponse } from 'next/server';
import { getAllCategories, createCategory } from '@/services/category-service';

export async function GET() {
  try {
    const categorias = await getAllCategories();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();

    if (!nombre) {
       return new NextResponse(JSON.stringify({ message: 'El nombre es requerido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const nuevaCategoria = await createCategory(nombre);

    return NextResponse.json(nuevaCategoria, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear la categoría:', error);
    if (error.message === 'La categoría ya existe.') {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
