import { type NextRequest, NextResponse } from 'next/server';
import { getAllProveedores, createProveedor } from '@/services/proveedor-service';

export async function GET() {
  try {
    const proveedores = await getAllProveedores();
    return NextResponse.json(proveedores);
  } catch (error) {
    console.error('Error al obtener los proveedores:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, contacto, telefono } = await request.json();

    if (!nombre || !contacto || !telefono) {
       return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const nuevoProveedor = await createProveedor({ nombre, contacto, telefono });

    return NextResponse.json(nuevoProveedor, { status: 201 });

  } catch (error) {
    console.error('Error al crear el proveedor:', error);
    if (error instanceof Error && error.message === 'El proveedor ya existe.') {
        return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
