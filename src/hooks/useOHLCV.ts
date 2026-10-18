import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../lib/apiClient';
import type { OHLCVRange, OHLCVSeries } from '../types/instrumentDetail';

interface UseOHLCVResult {
  data: OHLCVSeries | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetches historical OHLCV bars for a ticker and range. Does not fetch when
 * ticker is missing (e.g. while the detail call is still resolving).
 */
export function useOHLCV(ticker: string | undefined, range: OHLCVRange): UseOHLCVResult {
  const [data, setData] = useState<OHLCVSeries | null>(null);
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
      .get<OHLCVSeries>(`/api/v1/instruments/${encodeURIComponent(ticker)}/ohlcv?range=${range}`)
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
  }, [ticker, range]);

  return { data, loading, error };
}
