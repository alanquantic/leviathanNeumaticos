/**
 * FINANCIAL CALCULATIONS LIBRARY
 * 
 * Industrial Financial Engine (IFE) para cálculos de:
 * - CAPEX Amortization
 * - NPV (Net Present Value)
 * - IRR (Internal Rate of Return)
 * - Cash Flow Projections
 * - EBITDA & Profitability Metrics
 * - Token Yield Calculations
 */

export interface EquipmentData {
  machineName: string;
  stageNumber: number;
  totalCapex: number;
  usefulLifeYears: number;
  usefulLifeHours: number;
  annualMaintenanceRate: number;
  insuranceRate: number;
}

export interface ProductCostData {
  productType: string;
  opexPerTon: number;
  stagesUsed: number[];
}

export interface RevenueData {
  productType: string;
  pricePerTon: number;
  annualTons: number;
}

export interface PlantOperations {
  tonsPerDay: number;
  operatingDaysPerYear: number;
  uptimePercentage: number;
  productMix: {
    chips_3: number; // %
    chips_1: number; // %
    crumb: number;   // %
  };
}

/**
 * CAPEX AMORTIZATION
 * Calcula el costo de CAPEX amortizado por tonelada
 */
export function calculateCapexPerTon(
  equipment: EquipmentData[],
  annualTons: number,
  stagesUsed: number[]
): number {
  let totalAnnualCapexCost = 0;

  for (const eq of equipment) {
    if (stagesUsed.includes(eq.stageNumber as any)) {
      // Depreciación anual (straight line)
      const annualDepreciation = eq.totalCapex / eq.usefulLifeYears;
      
      // Maintenance anual
      const annualMaintenance = eq.totalCapex * eq.annualMaintenanceRate;
      
      // Insurance anual
      const annualInsurance = eq.totalCapex * eq.insuranceRate;
      
      totalAnnualCapexCost += annualDepreciation + annualMaintenance + annualInsurance;
    }
  }

  return annualTons > 0 ? totalAnnualCapexCost / annualTons : 0;
}

/**
 * DEPRECIATION SCHEDULE
 * Genera tabla de depreciación por año
 */
export function generateDepreciationSchedule(
  equipment: EquipmentData,
  years: number
): Array<{
  year: number;
  bookValue: number;
  depreciation: number;
  accumulatedDepreciation: number;
}> {
  const schedule = [];
  const annualDepreciation = equipment.totalCapex / equipment.usefulLifeYears;
  let accumulatedDepreciation = 0;

  for (let year = 1; year <= years; year++) {
    if (year <= equipment.usefulLifeYears) {
      accumulatedDepreciation += annualDepreciation;
    }
    
    const bookValue = Math.max(0, equipment.totalCapex - accumulatedDepreciation);
    
    schedule.push({
      year,
      bookValue,
      depreciation: year <= equipment.usefulLifeYears ? annualDepreciation : 0,
      accumulatedDepreciation,
    });
  }

  return schedule;
}

/**
 * TRUE COST PER TON
 * OPEX + CAPEX amortizado
 */
export function calculateTrueCostPerTon(
  opexPerTon: number,
  capexPerTon: number
): number {
  return opexPerTon + capexPerTon;
}

/**
 * ANNUAL PRODUCTION CALCULATION
 * Calcula toneladas anuales por producto
 */
export function calculateAnnualProduction(
  plantOps: PlantOperations
): {
  totalTons: number;
  chips3Tons: number;
  chips1Tons: number;
  crumbTons: number;
} {
  const effectiveTonsPerDay = plantOps.tonsPerDay * plantOps.uptimePercentage;
  const totalTons = effectiveTonsPerDay * plantOps.operatingDaysPerYear;

  return {
    totalTons,
    chips3Tons: totalTons * (plantOps.productMix.chips_3 / 100),
    chips1Tons: totalTons * (plantOps.productMix.chips_1 / 100),
    crumbTons: totalTons * (plantOps.productMix.crumb / 100),
  };
}

/**
 * REVENUE CALCULATION
 * Calcula ingresos anuales por producto
 */
export function calculateAnnualRevenue(
  production: ReturnType<typeof calculateAnnualProduction>,
  prices: {
    chips_3: number;
    chips_1: number;
    crumb: number;
  }
): {
  totalRevenue: number;
  revenueChips3: number;
  revenueChips1: number;
  revenueCrumb: number;
} {
  const revenueChips3 = production.chips3Tons * prices.chips_3;
  const revenueChips1 = production.chips1Tons * prices.chips_1;
  const revenueCrumb = production.crumbTons * prices.crumb;

  return {
    totalRevenue: revenueChips3 + revenueChips1 + revenueCrumb,
    revenueChips3,
    revenueChips1,
    revenueCrumb,
  };
}

/**
 * OPEX CALCULATION
 * Calcula OPEX anual por producto mix
 */
export function calculateAnnualOpex(
  production: ReturnType<typeof calculateAnnualProduction>,
  costsPerTon: {
    chips_3: number;
    chips_1: number;
    crumb: number;
  }
): {
  totalOpex: number;
  opexChips3: number;
  opexChips1: number;
  opexCrumb: number;
} {
  const opexChips3 = production.chips3Tons * costsPerTon.chips_3;
  const opexChips1 = production.chips1Tons * costsPerTon.chips_1;
  const opexCrumb = production.crumbTons * costsPerTon.crumb;

  return {
    totalOpex: opexChips3 + opexChips1 + opexCrumb,
    opexChips3,
    opexChips1,
    opexCrumb,
  };
}

/**
 * CAPEX ANNUAL COST
 * Calcula costo anual total de CAPEX (depreciación + maintenance + insurance)
 */
export function calculateAnnualCapexCost(
  equipment: EquipmentData[]
): number {
  let totalAnnualCost = 0;

  for (const eq of equipment) {
    const annualDepreciation = eq.totalCapex / eq.usefulLifeYears;
    const annualMaintenance = eq.totalCapex * eq.annualMaintenanceRate;
    const annualInsurance = eq.totalCapex * eq.insuranceRate;
    
    totalAnnualCost += annualDepreciation + annualMaintenance + annualInsurance;
  }

  return totalAnnualCost;
}

/**
 * EBITDA CALCULATION
 * Earnings Before Interest, Taxes, Depreciation, and Amortization
 */
export function calculateEBITDA(
  revenue: number,
  opex: number
): number {
  return revenue - opex;
}

/**
 * EBIT CALCULATION
 * Earnings Before Interest and Taxes (EBITDA - Depreciation)
 */
export function calculateEBIT(
  ebitda: number,
  depreciation: number
): number {
  return ebitda - depreciation;
}

/**
 * NET INCOME (simplified)
 * Sin considerar intereses ni impuestos por ahora
 */
export function calculateNetIncome(
  ebit: number,
  interestExpense: number = 0,
  taxRate: number = 0
): number {
  const ebt = ebit - interestExpense;
  const taxes = ebt * taxRate;
  return ebt - taxes;
}

/**
 * CASH FLOW PROJECTION
 * Genera proyección de cash flow multi-año
 */
export interface YearlyProjection {
  year: number;
  revenue: number;
  opex: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  netIncome: number;
  cashFlow: number;
  cumulativeCashFlow: number;
}

export function generateCashFlowProjection(
  equipment: EquipmentData[],
  plantOps: PlantOperations,
  prices: { chips_3: number; chips_1: number; crumb: number },
  costsPerTon: { chips_3: number; chips_1: number; crumb: number },
  years: number,
  initialInvestment: number = 0
): YearlyProjection[] {
  const projections: YearlyProjection[] = [];
  let cumulativeCashFlow = -initialInvestment; // Inversión inicial es negativa

  const production = calculateAnnualProduction(plantOps);
  const annualRevenue = calculateAnnualRevenue(production, prices);
  const annualOpex = calculateAnnualOpex(production, costsPerTon);
  const totalDepreciation = equipment.reduce((sum, eq) => 
    sum + (eq.totalCapex / eq.usefulLifeYears), 0
  );

  for (let year = 1; year <= years; year++) {
    const ebitda = calculateEBITDA(annualRevenue.totalRevenue, annualOpex.totalOpex);
    const ebit = calculateEBIT(ebitda, totalDepreciation);
    const netIncome = calculateNetIncome(ebit);
    
    // Cash Flow = Net Income + Depreciation (non-cash expense)
    const cashFlow = netIncome + totalDepreciation;
    cumulativeCashFlow += cashFlow;

    projections.push({
      year,
      revenue: annualRevenue.totalRevenue,
      opex: annualOpex.totalOpex,
      ebitda,
      depreciation: totalDepreciation,
      ebit,
      netIncome,
      cashFlow,
      cumulativeCashFlow,
    });
  }

  return projections;
}

/**
 * NPV (Net Present Value)
 * Calcula el valor presente neto de un flujo de caja
 */
export function calculateNPV(
  cashFlows: number[],
  discountRate: number,
  initialInvestment: number = 0
): number {
  let npv = -initialInvestment;

  for (let year = 0; year < cashFlows.length; year++) {
    npv += cashFlows[year] / Math.pow(1 + discountRate, year + 1);
  }

  return npv;
}

/**
 * IRR (Internal Rate of Return)
 * Calcula la tasa interna de retorno usando Newton-Raphson
 */
export function calculateIRR(
  cashFlows: number[],
  initialInvestment: number,
  guess: number = 0.1
): number {
  const maxIterations = 100;
  const tolerance = 0.0001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = -initialInvestment;
    let dnpv = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      const period = t + 1;
      npv += cashFlows[t] / Math.pow(1 + rate, period);
      dnpv -= (period * cashFlows[t]) / Math.pow(1 + rate, period + 1);
    }

    const newRate = rate - npv / dnpv;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }

    rate = newRate;
  }

  return rate;
}

/**
 * PAYBACK PERIOD
 * Calcula cuántos años toma recuperar la inversión inicial
 */
export function calculatePaybackPeriod(
  projections: YearlyProjection[]
): number | null {
  for (let i = 0; i < projections.length; i++) {
    if (projections[i].cumulativeCashFlow >= 0) {
      // Interpolación para obtener el momento exacto
      if (i === 0) return projections[i].year;
      
      const prevYear = projections[i - 1];
      const currYear = projections[i];
      const fraction = Math.abs(prevYear.cumulativeCashFlow) / currYear.cashFlow;
      
      return prevYear.year + fraction;
    }
  }
  
  return null; // No se recupera la inversión en el período proyectado
}

/**
 * TOKEN YIELD CALCULATION
 * Calcula el rendimiento anual por token
 */
export function calculateTokenYield(
  annualEBITDA: number,
  revenueSharePercentage: number,
  totalSupply: number,
  tokenPrice: number
): {
  annualDistribution: number;
  distributionPerToken: number;
  yieldPercentage: number;
} {
  const annualDistribution = annualEBITDA * revenueSharePercentage;
  const distributionPerToken = annualDistribution / totalSupply;
  const yieldPercentage = (distributionPerToken / tokenPrice) * 100;

  return {
    annualDistribution,
    distributionPerToken,
    yieldPercentage,
  };
}

/**
 * TOKEN BREAK-EVEN
 * Calcula cuántos meses toma recuperar la inversión en tokens
 */
export function calculateTokenBreakEven(
  tokenPrice: number,
  annualDistributionPerToken: number
): number | null {
  if (annualDistributionPerToken <= 0) return null;
  
  const years = tokenPrice / annualDistributionPerToken;
  return Math.ceil(years * 12); // en meses
}

/**
 * GROSS MARGIN
 */
export function calculateGrossMargin(
  revenue: number,
  costs: number
): number {
  return revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0;
}

/**
 * EBITDA MARGIN
 */
export function calculateEBITDAMargin(
  ebitda: number,
  revenue: number
): number {
  return revenue > 0 ? (ebitda / revenue) * 100 : 0;
}
