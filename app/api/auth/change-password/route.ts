import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { currentPassword, newPassword } = req;
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    // Get token from cookies (await cookies for environments where it returns a Promise)
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    // Verify JWT
    let payload;
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload: jwtPayload } = await jwtVerify(token, secret);
      payload = jwtPayload;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }
    // Find user
    const userId = typeof payload.id === 'number' ? payload.id : undefined;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    // Check current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update password
    await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 