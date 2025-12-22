// Types for Leviathan Gate Analysis Results

export type TransparencyLevel = 'TRANSPARENT' | 'NON_TRANSPARENT';

export type ContractConfidence = 'NONE' | 'VERBAL' | 'LOI' | 'SIGNED';

export type Verdict = 'Viable' | 'No viable' | 'Viable con ajustes';

export type TokenizationLevel = 
  | 'No tokenizable' 
  | 'Tokenizable con cambios' 
  | 'Tokenizable como RWA';

export type GateVerdict = 'PASSED' | 'CONDITIONAL' | 'REJECTED';

export interface ExecutiveSummary {
  verdict: Verdict;
  score: number;
  topRisks: string[];
  topCorrections: string[];
  tokenizationLevel: TokenizationLevel;
  comment?: string;
  gateVerdict?: GateVerdict;
}

export interface Scores {
  infrastructure: number;
  production: number;
  financials: number;
  risks: number;
}

export interface KeyFindings {
  infrastructure: string;
  production: string;
  financials: string;
  dependencies?: string;
}

export interface TippingMetrics {
  revenue: number;
  ebitda: number;
  ebitda_margin_pct: number;
}

export interface TippingFeeSummary {
  detected: boolean;
  transparency?: TransparencyLevel;
  is_assumption?: boolean;
  tf_net_low?: number;
  tf_net_base?: number;
  tf_net_high?: number;
  tf_share?: number;
  contract_confidence?: ContractConfidence;
  contract_tenor_years?: number;
  customer_concentration_pct?: number;
}

export interface BaseCaseComparison {
  with_tipping: TippingMetrics;
  without_tipping: TippingMetrics;
}

export interface TippingScoring {
  penalties_applied: string[];
  total_penalty_points: number;
  auto_reject_triggered: boolean;
}

export interface AnalysisData {
  documentType?: string;
  executiveSummary?: ExecutiveSummary;
  scores?: Scores;
  keyFindings?: KeyFindings;
  tippingFeeSummary?: TippingFeeSummary;
  baseCaseComparison?: BaseCaseComparison;
  tippingScoring?: TippingScoring;
  fullAnalysis?: string;
}


