/** Mirrors backend/internal/market/provider.go InstrumentSummary + the
 * instrumentSearchResponse JSON contract from
 * backend/internal/handler/instrument_handler.go. */
export interface InstrumentSummary {
  ticker: string;
  company_name: string;
  exchange: string;
}

export interface InstrumentSearchResponse {
  query: string;
  results: InstrumentSummary[];
  message?: string;
}
