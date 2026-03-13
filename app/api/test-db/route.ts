import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW()');
    return NextResponse.json({ now: result.rows[0] });
  } catch (error) {
    console.error('DB test failed', error);
    return NextResponse.json({ error: 'connection error' }, { status: 500 });
  }
}
