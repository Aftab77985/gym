import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the last 12 months
    const now = new Date();
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    // Get all members created in the last 12 months
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const members = await prisma.member.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true },
    });
    // Count per month
    const counts: Record<string, number> = {};
    for (const m of months) counts[m] = 0;
    for (const member of members) {
      const d = member.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (counts[key] !== undefined) counts[key]++;
    }
    const result = months.map(month => ({ month, count: counts[month] }));
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics.' }, { status: 500 });
  }
} 