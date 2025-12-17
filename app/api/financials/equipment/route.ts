import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const equipment = await prisma.equipmentFinancial.findMany({
      orderBy: { stageNumber: 'asc' },
    });
    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment financials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment financials' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    // Recalcular totalCapex si cambio purchasePrice o installationCost
    if (updateData.purchasePrice !== undefined || updateData.installationCost !== undefined) {
      const current = await prisma.equipmentFinancial.findUnique({ where: { id } });
      if (current) {
        updateData.totalCapex = 
          (updateData.purchasePrice ?? current.purchasePrice) + 
          (updateData.installationCost ?? current.installationCost);
      }
    }

    const updated = await prisma.equipmentFinancial.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating equipment financial:', error);
    return NextResponse.json(
      { error: 'Failed to update equipment financial' },
      { status: 500 }
    );
  }
}
