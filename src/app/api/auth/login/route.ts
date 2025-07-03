import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getEmployeeByEmail } from '@/services/employee-service';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Correo y contraseña son requeridos' }, { status: 400 });
    }

    const user = await getEmployeeByEmail(email);

    if (!user || !user.password) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    session.user = userWithoutPassword;
    await session.save();

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
