import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stages = await prisma.processingStage.findMany({
      include: {
        utilityCosts: true,
        productionLabor: true,
        maintenanceLabor: true,
      },
      orderBy: {
        stageNumber: 'asc',
      },
    });

    return NextResponse.json(stages);
  } catch (error) {
    console.error('Error fetching stages:', error);
    return NextResponse.json({ error: 'Failed to fetch stages' }, { status: 500 });
  }
}
