import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const today = new Date();
    const active = await prisma.member.count({ where: { membershipEnd: { gte: today } } });
    const inactive = await prisma.member.count({ where: { membershipEnd: { lt: today } } });
    return NextResponse.json({ active, inactive });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics.' }, { status: 500 });
  }
} 