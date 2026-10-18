/**
 * Types mirroring backend/internal/market/provider.go FinancialPeriod,
 * FinancialMetric, FinancialRatio, and FundamentalSummary.
 */
import type { FreshnessStatus } from './market';

export type PeriodType = 'annual' | 'quarterly';

export interface FinancialPeriod {
  fiscal_year: number;
  fiscal_quarter: number | null;
  period_end: string;
  currency: string;
  unit: string;
  source_document?: string;
}

export interface FinancialMetric {
  name: string;
  label: string;
  fiscal_year: number;
  fiscal_quarter: number | null;
  value: number;
  unit: string;
}

export interface FinancialRatio {
  name: string;
  label: string;
  fiscal_year: number;
  fiscal_quarter: number | null;
  value: number;
  formula: string;
}

export interface FundamentalSummary {
  ticker: string;
  period_type: PeriodType;
  periods: FinancialPeriod[];
  metrics: FinancialMetric[];
  ratios: FinancialRatio[];
  freshness: FreshnessStatus;
  source: string;
  message?: string;
}
