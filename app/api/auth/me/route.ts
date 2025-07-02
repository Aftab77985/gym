import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    let payload;
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload: jwtPayload } = await jwtVerify(token, secret);
      payload = jwtPayload;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }
    // Optionally fetch name from DB
    const userId = typeof payload.id === 'number' ? payload.id : undefined;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 