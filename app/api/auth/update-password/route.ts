import { type NextRequest, NextResponse } from 'next/server';
import { updateEmployeePassword, getEmployeeByEmail } from '@/services/employee-service';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Correo y nueva contraseña son requeridos' }, { status: 400 });
    }

    // Verify user exists before attempting to update
    const user = await getEmployeeByEmail(email);
    if (!user) {
        // Still return a generic message to prevent email enumeration
        return NextResponse.json({ message: 'La contraseña ha sido actualizada exitosamente.' });
    }

    const success = await updateEmployeePassword(email, password);

    if (!success) {
      throw new Error('No se pudo actualizar la contraseña en la base de datos.');
    }

    return NextResponse.json({ message: 'La contraseña ha sido actualizada exitosamente.' });
  } catch (error) {
    console.error('Update password error:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
