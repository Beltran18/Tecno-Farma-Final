import { getIronSession, type IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { type Empleado } from './types';

const sessionPassword = process.env.SESSION_SECRET;

if (!sessionPassword) {
  throw new Error('La variable de entorno SESSION_SECRET no está configurada. Por favor, añádela a tu archivo .env');
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
  // No es necesario crear objetos falsos ni manipular las cookies manualmente.
  // Esta es la implementación moderna y correcta para el App Router.
  const session = await getIronSession<IronSessionData & { user?: Omit<Empleado, 'password'> }>(
    cookies(),
    sessionOptions
  );
  return session;
}
