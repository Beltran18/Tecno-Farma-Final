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
        return new NextResponse(JSON.stringify({ message: 'Rol no válido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const empleadoActualizado = await updateEmployee(params.id, datosActualizados);

    if (!empleadoActualizado) {
      return new NextResponse(JSON.stringify({ message: 'Empleado no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return NextResponse.json(empleadoActualizado);
  } catch (error: any) {
    console.error('Error al actualizar el empleado:', error);
    if (error.message.includes('correo electrónico ya está en uso')) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fueEliminado = await deleteEmployee(params.id);

    if (!fueEliminado) {
      return new NextResponse(JSON.stringify({ message: 'Empleado no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error al eliminar el empleado:', error);
    return new NextResponse(JSON.stringify({ message: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
