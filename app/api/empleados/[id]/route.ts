import { type NextRequest, NextResponse } from 'next/server';
import { updateEmployee, deleteEmployee } from '@/services/employee-service';
import { RolEmpleado } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const datosActualizados = await request.json();
    
    if (datosActualizados.rol && !Object.values(RolEmpleado).includes(datosActualizados.rol)) {
        return NextResponse.json({ message: 'Rol no válido' }, { status: 400 });
    }

    const empleadoActualizado = await updateEmployee(params.id, datosActualizados);

    if (!empleadoActualizado) {
      return NextResponse.json({ message: 'Empleado no encontrado' }, { status: 404 });
    }

    return NextResponse.json(empleadoActualizado);
  } catch (error) {
    console.error('Error al actualizar el empleado:', error);
    if (error instanceof Error && error.message.includes('correo electrónico ya está en uso')) {
        return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fueEliminado = await deleteEmployee(params.id);

    if (!fueEliminado) {
      return NextResponse.json({ message: 'Empleado no encontrado' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar el empleado:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ message }, { status: 500 });
  }
}
