import { getIronSession, type IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { type Empleado } from './types';

export const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'tecnofarma-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession() {
  const session = await getIronSession<IronSessionData & { user?: Omit<Empleado, 'password'> }>(
    cookies(),
    sessionOptions
  );
  return session;
}
