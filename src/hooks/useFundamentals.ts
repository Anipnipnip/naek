import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../lib/apiClient';
import type { FundamentalSummary, PeriodType } from '../types/fundamentals';

interface UseFundamentalsResult {
  data: FundamentalSummary | null;
  loading: boolean;
  error: string | null;
}

/** Fetches fundamental financial data for a ticker and period type. */
export function useFundamentals(ticker: string | undefined, periodType: PeriodType): UseFundamentalsResult {
  const [data, setData] = useState<FundamentalSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiClient
      .get<FundamentalSummary>(`/api/v1/instruments/${encodeURIComponent(ticker)}/fundamentals?period=${periodType}`)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setData(null);
          setError(err instanceof ApiError ? err.message : 'Terjadi kesalahan tidak terduga.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ticker, periodType]);

  return { data, loading, error };
}
