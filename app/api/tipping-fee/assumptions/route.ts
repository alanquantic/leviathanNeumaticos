import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the first (current) project assumption
    const assumption = await prisma.projectRevenueAssumption.findFirst({
      include: {
        tippingFeeProfile: {
          include: {
            components: true,
          },
        },
      },
    });

    if (!assumption) {
      return NextResponse.json(
        { error: 'No project revenue assumption found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assumption);
  } catch (error) {
    console.error('Error fetching project revenue assumption:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project revenue assumption' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Update the first assumption (we're using a single-project model for now)
    const assumption = await prisma.projectRevenueAssumption.findFirst();

    if (!assumption) {
      return NextResponse.json(
        { error: 'No project revenue assumption found' },
        { status: 404 }
      );
    }

    const updated = await prisma.projectRevenueAssumption.update({
      where: { id: assumption.id },
      data: {
        tippingFeeEnabled: body.tippingFeeEnabled,
        tippingFeeProfileId: body.tippingFeeProfileId,
        tippingFeeScenario: body.tippingFeeScenario,
        tippingFeeApplyPercentage: body.tippingFeeApplyPercentage,
        contractConfidence: body.contractConfidence,
        contractTenorMonths: body.contractTenorMonths,
        contractConcentration: body.contractConcentration,
        expectedTonnagePerYear: body.expectedTonnagePerYear,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating project revenue assumption:', error);
    return NextResponse.json(
      { error: 'Failed to update project revenue assumption' },
      { status: 500 }
    );
  }
}
