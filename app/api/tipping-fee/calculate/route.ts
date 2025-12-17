import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  calculateTippingFeeBreakdown,
  calculateTippingFeeRevenue,
  calculateBaseCaseEBITDA,
  calculateEBITDAMargin,
  assessInvestmentViability,
} from '@/lib/tipping-fee-calcs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      profileId,
      scenario,
      applyPercentage,
      contractConfidence,
      throughputTonsPerYear,
      revenueSales,
      totalCosts,
    } = body;

    // Fetch profile with components
    const profile = await prisma.tippingFeeProfile.findUnique({
      where: { id: profileId },
      include: { components: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Tipping fee profile not found' },
        { status: 404 }
      );
    }

    // Calculate tipping fee breakdown
    const tfBreakdown = calculateTippingFeeBreakdown(
      profile.components,
      scenario
    );

    // Calculate revenue with tipping fee
    const tfRevenue = calculateTippingFeeRevenue(
      {
        enabled: true,
        scenario,
        applyPercentage,
        contractConfidence,
        throughputTonsPerYear,
      },
      tfBreakdown.netToRecycler,
      revenueSales
    );

    // Calculate base case EBITDA (without TF if not SIGNED)
    const baseCaseEBITDA = calculateBaseCaseEBITDA(
      revenueSales,
      tfRevenue.revenueTF,
      totalCosts,
      tfRevenue.includeInBaseCase
    );

    // Calculate with-tipping EBITDA
    const withTippingEBITDA = revenueSales + tfRevenue.revenueTF - totalCosts;

    // Calculate margins
    const baseCaseRevenue = tfRevenue.includeInBaseCase
      ? tfRevenue.revenueTotal
      : revenueSales;
    const baseCaseMargin = calculateEBITDAMargin(
      baseCaseEBITDA,
      baseCaseRevenue
    );
    const withTippingMargin = calculateEBITDAMargin(
      withTippingEBITDA,
      tfRevenue.revenueTotal
    );

    // Assess viability
    const baseCaseViability = assessInvestmentViability(baseCaseMargin);
    const withTippingViability = assessInvestmentViability(withTippingMargin);

    return NextResponse.json({
      breakdown: tfBreakdown,
      revenue: tfRevenue,
      baseCase: {
        ebitda: baseCaseEBITDA,
        revenue: baseCaseRevenue,
        margin: baseCaseMargin,
        viability: baseCaseViability,
      },
      withTipping: {
        ebitda: withTippingEBITDA,
        revenue: tfRevenue.revenueTotal,
        margin: withTippingMargin,
        viability: withTippingViability,
      },
    });
  } catch (error) {
    console.error('Error calculating tipping fee:', error);
    return NextResponse.json(
      { error: 'Failed to calculate tipping fee' },
      { status: 500 }
    );
  }
}
