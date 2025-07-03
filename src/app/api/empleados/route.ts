import { type NextRequest, NextResponse } from 'next/server';
import { getAllEmployees, createEmployee } from '@/services/employee-service';
import { RolEmpleado } from '@/lib/types';

export async function GET() {
  try {
    const empleados = await getAllEmployees();
    return NextResponse.json(empleados);
  } catch (error) {
    console.error('Error al obtener los empleados:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, rol } = await request.json();

    if (!nombre || !email || !rol) {
       return new NextResponse(JSON.stringify({ message: 'Todos los campos son requeridos' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (!Object.values(RolEmpleado).includes(rol)) {
        return new NextResponse(JSON.stringify({ message: 'Rol no válido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const nuevoEmpleado = await createEmployee({ nombre, email, rol });

    return NextResponse.json(nuevoEmpleado, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear el empleado:', error);
    if (error.message.includes('Ya existe un empleado')) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
