import { type NextRequest, NextResponse } from 'next/server';
import { getEmployeeByEmail } from '@/services/employee-service';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Correo electrónico es requerido' }, { status: 400 });
    }

    const user = await getEmployeeByEmail(email);

    // Security best practice: Don't reveal if an email is registered or not.
    // Always return a success-like message.
    if (user) {
      // In a real app, you would generate a token, save it to the DB with an expiry,
      // and email a link containing the token.
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      console.log('\n\n--- SIMULACIÓN DE CORREO PARA RESTABLECER CONTRASEÑA ---');
      console.log(`Para: ${user.email}`);
      console.log(`Asunto: Restablece tu contraseña de TecnoFarma`);
      console.log(`Token de restablecimiento: ${resetToken}`);
      console.log(`Enlace (simulado): http://localhost:9002/nueva-contrasena?token=${resetToken}&email=${encodeURIComponent(user.email)}`);
      console.log('-----------------------------------------------------------\n\n');
      console.log('NOTA: Este es un mensaje de simulación. En una aplicación real, se enviaría un correo electrónico.');
    }
    
    // Always return a generic success message to prevent user enumeration attacks.
    return NextResponse.json({ message: 'Si existe una cuenta con ese correo, se ha enviado un enlace de recuperación.' });

  } catch (error) {
    console.error('Password reset error:', error);
    // Don't expose internal errors to the client.
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
