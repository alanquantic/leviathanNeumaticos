import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productType, customCosts } = body ?? {};

    let stageNumbers: number[] = [];
    
    if (productType === '3-inch') {
      stageNumbers = [1];
    } else if (productType === '1-inch') {
      stageNumbers = [1, 2];
    } else if (productType === 'crumb') {
      stageNumbers = [1, 2, 3];
    } else {
      return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
    }

    const stages = await prisma.processingStage.findMany({
      where: {
        stageNumber: {
          in: stageNumbers,
        },
      },
      include: {
        utilityCosts: true,
        productionLabor: true,
        maintenanceLabor: true,
      },
      orderBy: {
        stageNumber: 'asc',
      },
    });

    const stagesWithCalculations = stages?.map((stage: any) => {
      const stageCustomCosts = customCosts?.[stage?.stageNumber ?? 0];

      let totalUtilities = 0;
      let totalProductionLabor = 0;
      let totalMaintenance = 0;

      const utilities = stage?.utilityCosts?.map((util: any) => {
        const customUtil = stageCustomCosts?.utilities?.find(
          (c: any) => c?.id === util?.id
        );
        
        const pricePerUnit = customUtil?.pricePerUnit ?? util?.pricePerUnit ?? 0;
        const usePerHour = customUtil?.usePerHour ?? util?.usePerHour ?? 0;
        const costPerHour = pricePerUnit * usePerHour;
        const costPerTon = costPerHour / (stage?.tonsPerHour ?? 1);
        
        totalUtilities += costPerTon;
        
        return {
          ...util,
          pricePerUnit,
          usePerHour,
          costPerHour,
          costPerTon,
        };
      }) ?? [];

      const production = stage?.productionLabor?.map((labor: any) => {
        const customLabor = stageCustomCosts?.production?.find(
          (c: any) => c?.id === labor?.id
        );
        
        const costPerHour = customLabor?.costPerHour ?? labor?.costPerHour ?? 0;
        const usePerHour = customLabor?.usePerHour ?? labor?.usePerHour ?? 0;
        const totalCostPerHour = costPerHour * usePerHour;
        const costPerTon = totalCostPerHour / (stage?.tonsPerHour ?? 1);
        
        totalProductionLabor += costPerTon;
        
        return {
          ...labor,
          costPerHour,
          usePerHour,
          totalCostPerHour,
          costPerTon,
        };
      }) ?? [];

      const maintenance = stage?.maintenanceLabor?.map((maint: any) => {
        const customMaint = stageCustomCosts?.maintenance?.find(
          (c: any) => c?.id === maint?.id
        );
        
        const costPerTon = customMaint?.costPerTon ?? maint?.costPerTon ?? 0;
        totalMaintenance += costPerTon;
        
        return {
          ...maint,
          costPerTon,
        };
      }) ?? [];

      return {
        ...stage,
        utilityCosts: utilities,
        productionLabor: production,
        maintenanceLabor: maintenance,
        calculatedTotalUtilities: totalUtilities,
        calculatedTotalProduction: totalProductionLabor,
        calculatedTotalMaintenance: totalMaintenance,
        calculatedTotalCost: totalUtilities + totalProductionLabor + totalMaintenance,
      };
    }) ?? [];

    const totalCostPerTon = stagesWithCalculations?.reduce(
      (sum: number, stage: any) => sum + (stage?.calculatedTotalCost ?? 0),
      0
    ) ?? 0;

    return NextResponse.json({
      productType,
      stages: stagesWithCalculations,
      totalCostPerTon,
    });
  } catch (error) {
    console.error('Error calculating costs:', error);
    return NextResponse.json({ error: 'Failed to calculate costs' }, { status: 500 });
  }
}
