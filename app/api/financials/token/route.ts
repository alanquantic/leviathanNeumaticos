import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let token = await prisma.tokenModel.findFirst();
    
    if (!token) {
      // Crear modelo por defecto si no existe
      token = await prisma.tokenModel.create({
        data: {
          plantName: 'Tire Recycling Plant #1',
          tokenName: 'TRP1 Revenue Share Token',
          tokenSymbol: 'TRP1',
          totalSupply: 1000000,
          tokenPrice: 10,
          totalRaise: 10000000,
          revenueSharePercentage: 0.70,
          distributionFrequency: 'quarterly',
          payoutCurrency: 'USDC',
          spvJurisdiction: 'Delaware',
          tokenType: 'revenue_share',
        },
      });
    }

    return NextResponse.json(token);
  } catch (error) {
    console.error('Error fetching token model:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token model' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    // Recalcular totalRaise si cambia totalSupply o tokenPrice
    if (updateData.totalSupply !== undefined || updateData.tokenPrice !== undefined) {
      const current = await prisma.tokenModel.findUnique({ where: { id } });
      if (current) {
        updateData.totalRaise = 
          (updateData.totalSupply ?? current.totalSupply) * 
          (updateData.tokenPrice ?? current.tokenPrice);
      }
    }

    const updated = await prisma.tokenModel.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating token model:', error);
    return NextResponse.json(
      { error: 'Failed to update token model' },
      { status: 500 }
    );
  }
}
