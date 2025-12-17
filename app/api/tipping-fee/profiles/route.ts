import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const profiles = await prisma.tippingFeeProfile.findMany({
      include: {
        components: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching tipping fee profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tipping fee profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const profile = await prisma.tippingFeeProfile.create({
      data: {
        name: body.name,
        description: body.description,
        feeLow: body.feeLow,
        feeBase: body.feeBase,
        feeHigh: body.feeHigh,
        isActive: body.isActive ?? true,
        isDefault: body.isDefault ?? false,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error creating tipping fee profile:', error);
    return NextResponse.json(
      { error: 'Failed to create tipping fee profile' },
      { status: 500 }
    );
  }
}
