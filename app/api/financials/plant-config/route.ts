import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Obtener la configuración por defecto (id = 1)
    let config = await prisma.plantConfiguration.findFirst();
    
    if (!config) {
      // Si no existe, crear una por defecto
      config = await prisma.plantConfiguration.create({
        data: {
          name: 'Default Plant Configuration',
          tonsPerDay: 100,
          operatingDaysPerYear: 330,
          uptimePercentage: 0.85,
          productMixChips3: 30,
          productMixChips1: 40,
          productMixCrumb: 30,
          activeScenario: 'base',
          marketSplit: 'local',
          localExportRatio: 0.80,
          discountRate: 0.12,
          projectionYears: 15,
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching plant configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plant configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const updated = await prisma.plantConfiguration.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating plant configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update plant configuration' },
      { status: 500 }
    );
  }
}
