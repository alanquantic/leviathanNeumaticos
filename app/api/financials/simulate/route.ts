import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  calculateAnnualProduction,
  calculateAnnualRevenue,
  calculateAnnualOpex,
  calculateEBITDA,
  generateCashFlowProjection,
  calculateNPV,
  calculateIRR,
  calculatePaybackPeriod,
  calculateTokenYield,
  calculateTokenBreakEven,
  calculateGrossMargin,
  calculateEBITDAMargin,
  calculateCapexPerTon,
  calculateTrueCostPerTon,
} from '@/lib/financial-calcs';
import {
  calculateTippingFeeBreakdown,
  calculateTippingFeeRevenue,
  type TippingFeeConfig,
} from '@/lib/tipping-fee-calcs';

export async function GET() {
  try {
    // Fetch all required data including tipping fee data
    const [stages, equipment, revenues, plantConfig, tokenModel, tippingFeeAssumption, tippingFeeProfile] = await Promise.all([
      prisma.processingStage.findMany({ orderBy: { stageNumber: 'asc' } }),
      prisma.equipmentFinancial.findMany({ orderBy: { stageNumber: 'asc' } }),
      prisma.productRevenue.findMany(),
      prisma.plantConfiguration.findFirst(),
      prisma.tokenModel.findFirst(),
      prisma.projectRevenueAssumption.findFirst(),
      prisma.tippingFeeProfile.findFirst({
        include: {
          components: true,
        },
      }),
    ]);

    if (!plantConfig || !tokenModel) {
      return NextResponse.json(
        { error: 'Plant configuration or token model not found' },
        { status: 404 }
      );
    }

    // Mapear costos OPEX por producto
    const costsPerTon = {
      chips_3: stages[0]?.totalCostPerTon ?? 0,
      chips_1: stages[0] && stages[1] 
        ? stages[0].totalCostPerTon + stages[1].totalCostPerTon 
        : 0,
      crumb: stages.reduce((sum: number, s: any) => sum + s.totalCostPerTon, 0),
    };

    // Obtener precios según escenario activo
    const scenario = plantConfig.activeScenario;
    const priceField = (base: string) => {
      if (plantConfig.marketSplit === 'export') {
        return `export${base}` as keyof typeof revenueMap[keyof typeof revenueMap];
      }
      return `local${base}` as keyof typeof revenueMap[keyof typeof revenueMap];
    };

    const scenarioSuffix = 
      scenario === 'conservative' ? 'Conservative' : 
      scenario === 'aggressive' ? 'Aggressive' : 'Base';

    const revenueMap = {
      chips_3: revenues.find((r: any) => r.productType === 'chips_3'),
      chips_1: revenues.find((r: any) => r.productType === 'chips_1'),
      crumb: revenues.find((r: any) => r.productType === 'crumb'),
    };

    const priceKey = plantConfig.marketSplit === 'export' 
      ? `exportPrice${scenarioSuffix}` 
      : `localPrice${scenarioSuffix}`;

    const prices = {
      chips_3: (revenueMap.chips_3?.[priceKey as keyof typeof revenueMap.chips_3] as number) ?? 0,
      chips_1: (revenueMap.chips_1?.[priceKey as keyof typeof revenueMap.chips_1] as number) ?? 0,
      crumb: (revenueMap.crumb?.[priceKey as keyof typeof revenueMap.crumb] as number) ?? 0,
    };

    // Calcular producción anual
    const plantOps = {
      tonsPerDay: plantConfig.tonsPerDay,
      operatingDaysPerYear: plantConfig.operatingDaysPerYear,
      uptimePercentage: plantConfig.uptimePercentage,
      productMix: {
        chips_3: plantConfig.productMixChips3,
        chips_1: plantConfig.productMixChips1,
        crumb: plantConfig.productMixCrumb,
      },
    };

    const production = calculateAnnualProduction(plantOps);
    const annualRevenue = calculateAnnualRevenue(production, prices);
    const annualOpex = calculateAnnualOpex(production, costsPerTon);

    // Calculate Tipping Fee Revenue
    let tippingFeeData = {
      enabled: false,
      revenueTF: 0,
      tfShare: 0,
      includeInBaseCase: false,
      breakdown: {
        feeTotal: 0,
        passThrough: 0,
        netToRecycler: 0,
      },
    };

    if (
      tippingFeeAssumption?.tippingFeeEnabled &&
      tippingFeeProfile &&
      tippingFeeAssumption.tippingFeeScenario !== 'OFF'
    ) {
      // Calculate fee breakdown
      const breakdown = calculateTippingFeeBreakdown(
        tippingFeeProfile.components as any,
        tippingFeeAssumption.tippingFeeScenario as 'LOW' | 'BASE' | 'HIGH'
      );

      // Calculate tipping fee revenue
      const tfConfig: TippingFeeConfig = {
        enabled: tippingFeeAssumption.tippingFeeEnabled,
        scenario: tippingFeeAssumption.tippingFeeScenario as 'LOW' | 'BASE' | 'HIGH' | 'OFF',
        applyPercentage: tippingFeeAssumption.tippingFeeApplyPercentage,
        contractConfidence: tippingFeeAssumption.contractConfidence as 'NONE' | 'VERBAL' | 'LOI' | 'SIGNED',
        throughputTonsPerYear: production.totalTons,
      };

      const tfRevenue = calculateTippingFeeRevenue(
        tfConfig,
        breakdown.netToRecycler,
        annualRevenue.totalRevenue
      );

      tippingFeeData = {
        enabled: true,
        revenueTF: tfRevenue.revenueTF,
        tfShare: tfRevenue.tfShare,
        includeInBaseCase: tfRevenue.includeInBaseCase,
        breakdown: {
          feeTotal: breakdown.feeTotal,
          passThrough: breakdown.passThrough,
          netToRecycler: breakdown.netToRecycler,
        },
      };
    }

    // Total revenue including tipping fee
    const totalRevenueWithTF = annualRevenue.totalRevenue + tippingFeeData.revenueTF;

    // Calcular CAPEX amortizado por producto
    const capexPerTon = {
      chips_3: calculateCapexPerTon(
        equipment as any,
        production.chips3Tons,
        [1]
      ),
      chips_1: calculateCapexPerTon(
        equipment as any,
        production.chips1Tons,
        [1, 2]
      ),
      crumb: calculateCapexPerTon(
        equipment as any,
        production.crumbTons,
        [1, 2, 3]
      ),
    };

    // True Cost per Ton (OPEX + CAPEX)
    const trueCostPerTon = {
      chips_3: calculateTrueCostPerTon(costsPerTon.chips_3, capexPerTon.chips_3),
      chips_1: calculateTrueCostPerTon(costsPerTon.chips_1, capexPerTon.chips_1),
      crumb: calculateTrueCostPerTon(costsPerTon.crumb, capexPerTon.crumb),
    };

    // EBITDA (using total revenue including tipping fee)
    const ebitda = calculateEBITDA(totalRevenueWithTF, annualOpex.totalOpex);

    // Total CAPEX investment
    const totalCapexInvestment = equipment.reduce((sum: number, eq: any) => sum + eq.totalCapex, 0);

    // Proyecciones de cash flow
    let cashFlowProjections = generateCashFlowProjection(
      equipment as any,
      plantOps,
      prices,
      costsPerTon,
      plantConfig.projectionYears,
      totalCapexInvestment
    );

    // Adjust projections to include tipping fee revenue in each year
    if (tippingFeeData.enabled && tippingFeeData.revenueTF > 0) {
      cashFlowProjections = cashFlowProjections.map(projection => {
        const adjustedRevenue = projection.revenue + tippingFeeData.revenueTF;
        const adjustedEbitda = projection.ebitda + tippingFeeData.revenueTF;
        const adjustedEbit = projection.ebit + tippingFeeData.revenueTF;
        const adjustedNetIncome = projection.netIncome + tippingFeeData.revenueTF;
        const adjustedCashFlow = projection.cashFlow + tippingFeeData.revenueTF;
        const adjustedCumulativeCashFlow = projection.cumulativeCashFlow + (tippingFeeData.revenueTF * projection.year);

        return {
          ...projection,
          revenue: adjustedRevenue,
          ebitda: adjustedEbitda,
          ebit: adjustedEbit,
          netIncome: adjustedNetIncome,
          cashFlow: adjustedCashFlow,
          cumulativeCashFlow: adjustedCumulativeCashFlow,
        };
      });
    }

    // Métricas financieras
    const cashFlows = cashFlowProjections.map(p => p.cashFlow);
    const npv = calculateNPV(cashFlows, plantConfig.discountRate, totalCapexInvestment);
    const irr = calculateIRR(cashFlows, totalCapexInvestment);
    const paybackPeriod = calculatePaybackPeriod(cashFlowProjections);

    // Token metrics
    const tokenYield = calculateTokenYield(
      ebitda,
      tokenModel.revenueSharePercentage,
      tokenModel.totalSupply,
      tokenModel.tokenPrice
    );

    const tokenBreakEven = calculateTokenBreakEven(
      tokenModel.tokenPrice,
      tokenYield.distributionPerToken
    );

    // Márgenes (using total revenue including tipping fee)
    const grossMargin = calculateGrossMargin(
      totalRevenueWithTF,
      annualOpex.totalOpex
    );

    const ebitdaMargin = calculateEBITDAMargin(
      ebitda,
      totalRevenueWithTF
    );

    // Construir respuesta completa
    const result = {
      // Configuración
      configuration: {
        plantConfig,
        scenario: plantConfig.activeScenario,
        marketSplit: plantConfig.marketSplit,
      },

      // Producción
      production: {
        ...production,
        effectiveTonsPerDay: plantConfig.tonsPerDay * plantConfig.uptimePercentage,
      },

      // Costos
      costs: {
        opexPerTon: costsPerTon,
        capexPerTon,
        trueCostPerTon,
        annualOpex: annualOpex.totalOpex,
      },

      // Precios
      pricing: prices,

      // Revenue (including tipping fee)
      revenue: {
        ...annualRevenue,
        revenueTippingFee: tippingFeeData.revenueTF,
        totalRevenue: totalRevenueWithTF, // Override with total including TF
        tippingFeeData,
      },

      // Métricas de rentabilidad
      profitability: {
        ebitda,
        ebitdaMargin,
        grossMargin,
        grossProfit: annualRevenue.totalRevenue - annualOpex.totalOpex,
      },

      // Métricas de inversión
      investment: {
        totalCapexInvestment,
        npv,
        irr: irr * 100, // en porcentaje
        paybackPeriodYears: paybackPeriod,
        discountRate: plantConfig.discountRate * 100,
      },

      // Token metrics
      token: {
        ...tokenModel,
        ...tokenYield,
        breakEvenMonths: tokenBreakEven,
      },

      // Proyecciones anuales
      projections: cashFlowProjections,

      // Equipment details
      equipment: equipment.map((eq: any) => ({
        machineName: eq.machineName,
        totalCapex: eq.totalCapex,
        usefulLifeYears: eq.usefulLifeYears,
        annualDepreciation: eq.totalCapex / eq.usefulLifeYears,
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error simulating financials:', error);
    return NextResponse.json(
      { error: 'Failed to simulate financials', details: String(error) },
      { status: 500 }
    );
  }
}
