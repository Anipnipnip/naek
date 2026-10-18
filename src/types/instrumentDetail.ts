/**
 * Types mirroring backend/internal/market/provider.go InstrumentDetail,
 * OHLCVBar, and OHLCVSeries — the Stock Explorer detail-page JSON contract.
 */
import type { FreshnessStatus, IndexSummary } from './market';

export interface InstrumentDetail {
  ticker: string;
  company_name: string;
  sector: string | null;
  exchange: string;
  listing_status: string;
  latest_price: IndexSummary | null;
  freshness: FreshnessStatus;
  source: string;
}

export interface OHLCVBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
}

export type OHLCVRange = '1M' | '3M' | '6M' | '1Y' | '5Y';

export interface OHLCVSeries {
  ticker: string;
  interval: string;
  range: string;
  bars: OHLCVBar[];
  freshness: FreshnessStatus;
  source: string;
  message?: string;
}
