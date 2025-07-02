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
       return new NextResponse(JSON.stringify({ message: 'Todos los campos son requeridos' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const nuevoProveedor = await createProveedor({ nombre, contacto, telefono });

    return NextResponse.json(nuevoProveedor, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear el proveedor:', error);
    if (error.message === 'El proveedor ya existe.') {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
