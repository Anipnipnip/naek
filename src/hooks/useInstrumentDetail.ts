import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../lib/apiClient';
import type { InstrumentDetail } from '../types/instrumentDetail';

interface UseInstrumentDetailResult {
  data: InstrumentDetail | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/**
 * Fetches instrument detail for a ticker. Distinguishes "ticker not found"
 * (HTTP 404 — the ticker itself is unknown) from other errors (network
 * failure, backend unavailable), since the UI should render different
 * messaging for each.
 */
export function useInstrumentDetail(ticker: string | undefined): UseInstrumentDetailResult {
  const [data, setData] = useState<InstrumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!ticker) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    apiClient
      .get<InstrumentDetail>(`/api/v1/instruments/${encodeURIComponent(ticker)}`)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setData(null);
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(err instanceof ApiError ? err.message : 'Terjadi kesalahan tidak terduga.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ticker]);

  return { data, loading, error, notFound };
}
