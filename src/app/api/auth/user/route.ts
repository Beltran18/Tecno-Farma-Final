import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  
  if (session.user) {
    return NextResponse.json(session.user);
  }

  return new NextResponse('No autenticado', { status: 401 });
}
