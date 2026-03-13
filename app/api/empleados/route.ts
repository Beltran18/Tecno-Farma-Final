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
    const { nombre, email, rol, password } = await request.json();

    if (!nombre || !email || !rol || !password) {
       return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
    }
    
    if (!Object.values(RolEmpleado).includes(rol)) {
        return NextResponse.json({ message: 'Rol no válido' }, { status: 400 });
    }

    const nuevoEmpleado = await createEmployee({ nombre, email, rol, password });

    return NextResponse.json(nuevoEmpleado, { status: 201 });

  } catch (error) {
    console.error('Error al crear el empleado:', error);
    if (error instanceof Error && error.message.includes('Ya existe un empleado')) {
        return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
