/**
 * Types mirroring the backend's market.MarketOverview / market.IndexSummary
 * JSON contract (backend/internal/market/provider.go). Keep these in sync
 * with the Go structs — this is the API contract between frontend and backend.
 */

export type FreshnessStatus = 'real_time' | 'delayed' | 'end_of_day' | 'unavailable';

export interface IndexSummary {
  code: string;
  name: string;
  value: number | null;
  change: number | null;
  change_percent: number | null;
  previous_close: number | null;
  observed_at?: string;
  source: string;
  freshness: FreshnessStatus;
}

export interface MarketOverviewResponse {
  indices: IndexSummary[];
  freshness: FreshnessStatus;
  source: string;
  updated_at?: string;
  message?: string;
}
