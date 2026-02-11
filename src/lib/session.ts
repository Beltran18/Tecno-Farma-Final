import { getIronSession, type IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { type Empleado } from './types';

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'dev-secret-change-this',
  cookieName: 'tecnofarma-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession() {
  const sessionPassword = process.env.SESSION_SECRET;

  // ✅ Validar AQUÍ, no fuera del archivo
  if (!sessionPassword) {
    throw new Error('SESSION_SECRET no configurada en variables de entorno');
  }

  const session = await getIronSession<IronSessionData & { user?: Omit<Empleado, 'password'> }>(
    cookies(),
    {
      ...sessionOptions,
      password: sessionPassword,
    }
  );

  return session;
}
