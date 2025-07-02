import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const memberId = parseInt(id, 10);
    await prisma.member.delete({ where: { id: memberId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete member.' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const memberId = parseInt(id, 10);
    const body = await request.json();
    const { name, phone, membershipStart, membershipEnd, amountPaid } = body;
    if (!name || !phone || !membershipStart || !membershipEnd || amountPaid === undefined || amountPaid === '') {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    // Get current user ID from JWT
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    let userId = null;
    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        userId = payload.id;
      } catch {}
    }
    // Update member
    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        name,
        phone,
        membershipStart: new Date(membershipStart),
        membershipEnd: new Date(membershipEnd),
        amountPaid: parseFloat(amountPaid),
      },
    });
    // Create renewal record if userId is available
    if (userId) {
      await prisma.renewal.create({
        data: {
          memberId: memberId,
          renewedByUserId: userId,
          renewStart: new Date(membershipStart),
          renewEnd: new Date(membershipEnd),
          amountPaid: parseFloat(amountPaid),
        },
      });
    }
    return NextResponse.json({ success: true, member });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update member.' }, { status: 500 });
  }
}

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const memberId = parseInt(id, 10);
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        renewals: {
          orderBy: { createdAt: 'desc' },
          include: {
            renewedBy: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
    if (!member) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }
    return NextResponse.json({ member });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch member.' }, { status: 500 });
  }
} 