import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const revenues = await prisma.productRevenue.findMany({
      orderBy: { productType: 'asc' },
    });
    return NextResponse.json(revenues);
  } catch (error) {
    console.error('Error fetching product revenues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product revenues' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const updated = await prisma.productRevenue.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product revenue:', error);
    return NextResponse.json(
      { error: 'Failed to update product revenue' },
      { status: 500 }
    );
  }
}
