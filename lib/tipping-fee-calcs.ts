/**
 * Tipping Fee Financial Calculations
 * 
 * Formulas:
 * 1. TF_net = fee_total - pass_throughs
 * 2. Revenue_TF = Throughput_ton * TF_net * (apply_pct / 100)
 * 3. Revenue_Total = Revenue_Sales + Revenue_TF
 * 4. TF_share = Revenue_TF / Revenue_Total
 * 5. Base Case Rule: if contract_confidence != SIGNED, exclude Revenue_TF from Base Case
 */

export interface TippingFeeComponent {
  componentName: string;
  amount: number;
  isPassThrough: boolean;
  category: string;
}

export interface TippingFeeCalculation {
  feeTotal: number;
  passThrough: number;
  netToRecycler: number;
  components: TippingFeeComponent[];
}

export interface TippingFeeRevenue {
  revenueTF: number;
  revenueSales: number;
  revenueTotal: number;
  tfShare: number; // percentage 0-100
  includeInBaseCase: boolean;
}

export interface TippingFeeConfig {
  enabled: boolean;
  scenario: 'LOW' | 'BASE' | 'HIGH' | 'OFF';
  applyPercentage: number; // 0-100
  contractConfidence: 'NONE' | 'VERBAL' | 'LOI' | 'SIGNED';
  throughputTonsPerYear: number;
}

/**
 * Calculate tipping fee using feed-in model
 * If feed-in value is present, compute TF_net = feed_in * retained_share
 * Otherwise, use default TF_net profile values
 */
export function calculateTippingFeeFromFeedIn(
  feedInValue: number | null,
  retainedShareLow: number | null,
  retainedShareBase: number | null,
  retainedShareHigh: number | null,
  scenario: 'LOW' | 'BASE' | 'HIGH'
): {
  netToRecycler: number;
  retainedShare: number;
  isAssumed: boolean;
  displayModel: 'FEED_IN' | 'DEFAULT_PROFILE';
} {
  // Default TF_net profile (USD/ton) if no feed-in is provided
  const DEFAULT_TF_NET = {
    LOW: 150,
    BASE: 250,
    HIGH: 350,
  };

  // Default retained share percentages if not provided
  const DEFAULT_RETAINED_SHARE = {
    LOW: 30,
    BASE: 45,
    HIGH: 60,
  };

  if (feedInValue && feedInValue > 0) {
    // Feed-in model: TF_net = feed_in * retained_share
    let retainedShare: number;
    if (scenario === 'LOW') {
      retainedShare = retainedShareLow ?? DEFAULT_RETAINED_SHARE.LOW;
    } else if (scenario === 'BASE') {
      retainedShare = retainedShareBase ?? DEFAULT_RETAINED_SHARE.BASE;
    } else {
      retainedShare = retainedShareHigh ?? DEFAULT_RETAINED_SHARE.HIGH;
    }
    
    const netToRecycler = feedInValue * (retainedShare / 100);
    
    return {
      netToRecycler,
      retainedShare,
      isAssumed: false,
      displayModel: 'FEED_IN',
    };
  } else {
    // Default profile model (ASSUMPTION)
    const netToRecycler = DEFAULT_TF_NET[scenario];
    const retainedShare = DEFAULT_RETAINED_SHARE[scenario];
    
    return {
      netToRecycler,
      retainedShare,
      isAssumed: true,
      displayModel: 'DEFAULT_PROFILE',
    };
  }
}

/**
 * Calculate tipping fee breakdown (component-based model)
 */
export function calculateTippingFeeBreakdown(
  components: Array<{
    amountLow: number;
    amountBase: number;
    amountHigh: number;
    isPassThrough: boolean;
    componentName: string;
    category: string;
  }>,
  scenario: 'LOW' | 'BASE' | 'HIGH'
): TippingFeeCalculation {
  let feeTotal = 0;
  let passThrough = 0;
  const resultComponents: TippingFeeComponent[] = [];

  for (const comp of components) {
    let amount = 0;
    if (scenario === 'LOW') amount = comp.amountLow;
    else if (scenario === 'BASE') amount = comp.amountBase;
    else if (scenario === 'HIGH') amount = comp.amountHigh;

    feeTotal += amount;
    if (comp.isPassThrough) {
      passThrough += amount;
    }

    resultComponents.push({
      componentName: comp.componentName,
      amount,
      isPassThrough: comp.isPassThrough,
      category: comp.category,
    });
  }

  const netToRecycler = feeTotal - passThrough;

  return {
    feeTotal,
    passThrough,
    netToRecycler,
    components: resultComponents,
  };
}

/**
 * Calculate tipping fee revenue
 */
export function calculateTippingFeeRevenue(
  config: TippingFeeConfig,
  tfNet: number,
  revenueSales: number
): TippingFeeRevenue {
  if (!config.enabled || config.scenario === 'OFF') {
    return {
      revenueTF: 0,
      revenueSales,
      revenueTotal: revenueSales,
      tfShare: 0,
      includeInBaseCase: false,
    };
  }

  // Revenue_TF = Throughput_ton * TF_net * (apply_pct / 100)
  const revenueTF =
    config.throughputTonsPerYear * tfNet * (config.applyPercentage / 100);

  const revenueTotal = revenueSales + revenueTF;
  const tfShare = revenueTotal > 0 ? (revenueTF / revenueTotal) * 100 : 0;

  // Base Case Rule: only include TF revenue if contract is SIGNED
  const includeInBaseCase = config.contractConfidence === 'SIGNED';

  return {
    revenueTF,
    revenueSales,
    revenueTotal,
    tfShare,
    includeInBaseCase,
  };
}

/**
 * Calculate base case EBITDA (without tipping fee if not SIGNED)
 */
export function calculateBaseCaseEBITDA(
  revenueSales: number,
  revenueTF: number,
  totalCosts: number,
  includeInBaseCase: boolean
): number {
  const revenue = includeInBaseCase
    ? revenueSales + revenueTF
    : revenueSales;
  return revenue - totalCosts;
}

/**
 * Calculate EBITDA margin
 */
export function calculateEBITDAMargin(
  ebitda: number,
  revenue: number
): number {
  return revenue > 0 ? (ebitda / revenue) * 100 : 0;
}

/**
 * Assess investment viability based on EBITDA margin
 */
export function assessInvestmentViability(
  ebitdaMargin: number,
  minThreshold: number = 12 // 12% minimum for RWA projects
): {
  isViable: boolean;
  status: 'excellent' | 'good' | 'marginal' | 'poor' | 'unviable';
  message: string;
} {
  if (ebitdaMargin >= 20) {
    return {
      isViable: true,
      status: 'excellent',
      message: 'Excellent EBITDA margin for institutional investment',
    };
  } else if (ebitdaMargin >= 15) {
    return {
      isViable: true,
      status: 'good',
      message: 'Strong EBITDA margin, attractive for investors',
    };
  } else if (ebitdaMargin >= minThreshold) {
    return {
      isViable: true,
      status: 'marginal',
      message: 'Acceptable EBITDA margin, meets minimum threshold',
    };
  } else if (ebitdaMargin >= 8) {
    return {
      isViable: false,
      status: 'poor',
      message: 'Below minimum EBITDA threshold for institutional investors',
    };
  } else {
    return {
      isViable: false,
      status: 'unviable',
      message: 'Critically low EBITDA margin, not suitable for investment',
    };
  }
}
