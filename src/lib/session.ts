import { getIronSession, type IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { type Empleado } from './types';

const sessionPassword = process.env.SESSION_SECRET;

// Verificación para depuración
if (sessionPassword) {
  console.log('✅ SESSION_SECRET cargada correctamente.');
} else {
  console.error('❌ ERROR: SESSION_SECRET no encontrada en process.env');
}

if (!sessionPassword) {
  throw new Error('La variable de entorno SESSION_SECRET no está configurada. Por favor, revisa tu archivo .env y reinicia el servidor.');
}

export const sessionOptions = {
  password: sessionPassword,
  cookieName: 'tecnofarma-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession() {
  // `getIronSession` funciona directamente con el `cookies()` de Next.js.
  const session = await getIronSession<IronSessionData & { user?: Omit<Empleado, 'password'> }>(
    cookies(),
    sessionOptions
  );
  return session;
}
