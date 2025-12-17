/**
 * Leviathan Gate Scoring System with Tipping Fee Integration
 * 
 * Automatic penalties:
 * - TF_share > 40% => -15 points
 * - TF_share > 60% => -30 points + red flag
 * - contract_confidence NONE => -25 points
 * - contract_confidence VERBAL => -20 points
 * - contract_confidence LOI => -10 points
 * - contract_confidence SIGNED => 0 points
 * - concentration > 50% => -10 points
 * - concentration > 75% => -20 points
 * 
 * Base-case rule:
 * - If confidence != SIGNED, evaluate investability using EBITDA without tipping
 * - If EBITDA margin < 12%, auto reject
 * 
 * Green flag:
 * - TF_share <= 30%, SIGNED, tenor >= 24mo, EBITDA w/o tipping >= 12% => +10 points
 */

export interface TippingFeeData {
  enabled: boolean;
  tfShare: number; // percentage 0-100
  contractConfidence: 'NONE' | 'VERBAL' | 'LOI' | 'SIGNED';
  contractTenorMonths: number | null;
  contractConcentration: number; // percentage 0-100
  ebitdaWithoutTipping: number; // in dollars
  ebitdaWithTipping: number; // in dollars
  revenueWithoutTipping: number; // in dollars
  netToRecycler: number; // USD/ton
}

export interface GateScoringResult {
  totalPenalty: number;
  totalBonus: number;
  netAdjustment: number;
  redFlags: string[];
  greenFlags: string[];
  recommendations: string[];
  autoReject: boolean;
  autoRejectReason?: string;
}

/**
 * Calculate Leviathan Gate score adjustments based on tipping fee structure
 */
export function scoreTippingFeeStructure(
  tippingFeeData: TippingFeeData
): GateScoringResult {
  let totalPenalty = 0;
  let totalBonus = 0;
  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  const recommendations: string[] = [];
  let autoReject = false;
  let autoRejectReason: string | undefined;

  if (!tippingFeeData.enabled) {
    return {
      totalPenalty: 0,
      totalBonus: 0,
      netAdjustment: 0,
      redFlags: [],
      greenFlags: [],
      recommendations: [],
      autoReject: false,
    };
  }

  // === TF_SHARE PENALTIES ===
  if (tippingFeeData.tfShare > 60) {
    totalPenalty += 30;
    redFlags.push(
      `CRITICAL: Tipping fee represents ${tippingFeeData.tfShare.toFixed(0)}% of total revenue. Extreme dependency on gate fees creates unsustainable business model.`
    );
    recommendations.push(
      'Diversify revenue streams to reduce tipping fee dependency below 40%'
    );
  } else if (tippingFeeData.tfShare > 40) {
    totalPenalty += 15;
    redFlags.push(
      `HIGH RISK: Tipping fee represents ${tippingFeeData.tfShare.toFixed(0)}% of total revenue. Over-reliance on gate fees poses significant revenue risk.`
    );
    recommendations.push(
      'Reduce tipping fee dependency to below 40% through product sales optimization'
    );
  }

  // === CONTRACT CONFIDENCE PENALTIES ===
  switch (tippingFeeData.contractConfidence) {
    case 'NONE':
      totalPenalty += 25;
      redFlags.push(
        'No tipping fee contract in place. Revenue projections are speculative and unverifiable.'
      );
      recommendations.push(
        'Secure at least a Letter of Intent (LOI) before seeking institutional capital'
      );
      break;
    case 'VERBAL':
      totalPenalty += 20;
      redFlags.push(
        'Verbal agreement only. No enforceable contract for tipping fee revenue.'
      );
      recommendations.push(
        'Convert verbal commitment to written Letter of Intent or signed contract'
      );
      break;
    case 'LOI':
      totalPenalty += 10;
      recommendations.push(
        'Letter of Intent secured. Proceed to signed contract to eliminate scoring penalty.'
      );
      break;
    case 'SIGNED':
      // No penalty
      greenFlags.push('Signed tipping fee contract provides revenue certainty');
      break;
  }

  // === CUSTOMER CONCENTRATION PENALTIES ===
  if (tippingFeeData.contractConcentration > 75) {
    totalPenalty += 20;
    redFlags.push(
      `EXTREME CONCENTRATION: ${tippingFeeData.contractConcentration.toFixed(0)}% of tipping fee revenue from single customer. Critical counterparty risk.`
    );
    recommendations.push(
      'Diversify tipping fee customer base to reduce concentration below 50%'
    );
  } else if (tippingFeeData.contractConcentration > 50) {
    totalPenalty += 10;
    recommendations.push(
      `Customer concentration (${tippingFeeData.contractConcentration.toFixed(0)}%) exceeds prudent threshold. Diversify to reduce single-customer dependency.`
    );
  }

  // === BASE CASE VIABILITY CHECK ===
  // If not SIGNED, evaluate without tipping fee
  if (tippingFeeData.contractConfidence !== 'SIGNED') {
    const ebitdaMargin =
      tippingFeeData.revenueWithoutTipping > 0
        ? (tippingFeeData.ebitdaWithoutTipping /
            tippingFeeData.revenueWithoutTipping) *
          100
        : 0;

    if (ebitdaMargin < 12) {
      autoReject = true;
      autoRejectReason = `Base case EBITDA margin without tipping fee is ${ebitdaMargin.toFixed(1)}%, below 12% minimum for institutional investors. Contract must be SIGNED or product sales must be improved.`;
      redFlags.push(
        `AUTO-REJECT: Base case EBITDA margin (${ebitdaMargin.toFixed(1)}%) fails to meet minimum 12% threshold for RWA projects.`
      );
    }
  }

  // === GREEN FLAG: OPTIMAL TIPPING FEE STRUCTURE ===
  if (
    tippingFeeData.tfShare <= 30 &&
    tippingFeeData.contractConfidence === 'SIGNED' &&
    tippingFeeData.contractTenorMonths !== null &&
    tippingFeeData.contractTenorMonths >= 24
  ) {
    const ebitdaMarginWithoutTipping =
      tippingFeeData.revenueWithoutTipping > 0
        ? (tippingFeeData.ebitdaWithoutTipping /
            tippingFeeData.revenueWithoutTipping) *
          100
        : 0;

    if (ebitdaMarginWithoutTipping >= 12) {
      totalBonus += 10;
      greenFlags.push(
        'OPTIMAL STRUCTURE: Low tipping fee dependency (<30%), signed long-term contract (24+ months), and strong standalone viability (12%+ EBITDA margin). Tipping fee provides pure upside.'
      );
    }
  }

  const netAdjustment = totalBonus - totalPenalty;

  return {
    totalPenalty,
    totalBonus,
    netAdjustment,
    redFlags,
    greenFlags,
    recommendations,
    autoReject,
    autoRejectReason,
  };
}

/**
 * Format tipping fee analysis for Gate report
 */
export function formatTippingFeeAnalysis(
  tippingFeeData: TippingFeeData,
  scoringResult: GateScoringResult
): string {
  if (!tippingFeeData.enabled) {
    return 'No tipping fee revenue included in project structure.';
  }

  const ebitdaMarginWithTipping =
    (tippingFeeData.ebitdaWithTipping /
      (tippingFeeData.revenueWithoutTipping +
        (tippingFeeData.ebitdaWithTipping -
          tippingFeeData.ebitdaWithoutTipping))) *
    100;

  const ebitdaMarginWithoutTipping =
    tippingFeeData.revenueWithoutTipping > 0
      ? (tippingFeeData.ebitdaWithoutTipping /
          tippingFeeData.revenueWithoutTipping) *
        100
      : 0;

  return `
### Tipping Fee Revenue Analysis

**Structure:**
- Tipping Fee Share: ${tippingFeeData.tfShare.toFixed(1)}% of total revenue
- Net to Recycler: $${tippingFeeData.netToRecycler.toFixed(2)}/ton
- Contract Status: ${tippingFeeData.contractConfidence}
- Contract Tenor: ${tippingFeeData.contractTenorMonths || 'N/A'} months
- Customer Concentration: ${tippingFeeData.contractConcentration.toFixed(0)}%

**Base Case (w/o Tipping Fee):**
- EBITDA: $${(tippingFeeData.ebitdaWithoutTipping / 1000000).toFixed(2)}M
- EBITDA Margin: ${ebitdaMarginWithoutTipping.toFixed(1)}%
- ${tippingFeeData.contractConfidence === 'SIGNED' ? 'Tipping fee INCLUDED in base case' : 'Tipping fee EXCLUDED from base case (not SIGNED)'}

**With Tipping Fee:**
- EBITDA: $${(tippingFeeData.ebitdaWithTipping / 1000000).toFixed(2)}M
- EBITDA Margin: ${ebitdaMarginWithTipping.toFixed(1)}%

**Gate Scoring Impact:**
- Penalties: ${scoringResult.totalPenalty} points
- Bonuses: ${scoringResult.totalBonus} points
- Net Adjustment: ${scoringResult.netAdjustment >= 0 ? '+' : ''}${scoringResult.netAdjustment} points
`;
}

/**
 * Apply hard auto-reject rule to enforce score cap
 * 
 * CRITICAL RULE:
 * If autoReject = true, the final score MUST be capped at 49 (REJECTED threshold)
 * This ensures the Gate Decision is REJECTED regardless of LLM-generated score
 */
export function applyAutoRejectEnforcement(
  originalScore: number,
  autoReject: boolean
): { finalScore: number; wasEnforced: boolean } {
  if (autoReject && originalScore > 49) {
    return {
      finalScore: 49, // Cap at REJECTED threshold
      wasEnforced: true,
    };
  }
  return {
    finalScore: originalScore,
    wasEnforced: false,
  };
}

/**
 * Determine Gate verdict based on score
 */
export function getGateVerdict(score: number): 'PASSED' | 'CONDITIONAL' | 'REJECTED' {
  if (score >= 70) return 'PASSED';
  if (score >= 50) return 'CONDITIONAL';
  return 'REJECTED';
}
