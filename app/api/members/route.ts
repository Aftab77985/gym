import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const skip = (page - 1) * pageSize;
    const [members, total] = await Promise.all([
      prisma.member.findMany({ skip, take: pageSize, orderBy: { membershipEnd: 'asc' } }),
      prisma.member.count(),
    ]);
    return NextResponse.json({ members, total });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);
    const { name, phone, membershipStart, membershipEnd, amountPaid } = body;
    if (!name || !phone || !membershipStart || !membershipEnd || amountPaid === undefined || amountPaid === '') {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    const existing = await prisma.member.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: 'A member with this phone number already exists.' }, { status: 409 });
    }
    const member = await prisma.member.create({
      data: {
        name,
        phone,
        membershipStart: new Date(membershipStart),
        membershipEnd: new Date(membershipEnd),
        amountPaid: parseFloat(amountPaid),
      },
    });
    return NextResponse.json({ success: true, member });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add member.' }, { status: 500 });
  }
} 