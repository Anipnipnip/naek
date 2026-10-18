import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../lib/apiClient';
import type { MarketOverviewResponse } from '../types/market';

interface UseMarketOverviewResult {
  data: MarketOverviewResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetches the market overview from the backend. Does not retry indefinitely
 * or substitute cached/fake data on failure — the caller is responsible for
 * rendering an honest loading/error/empty state.
 */
export function useMarketOverview(): UseMarketOverviewResult {
  const [data, setData] = useState<MarketOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.get<MarketOverviewResponse>('/api/v1/market/overview');
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Terjadi kesalahan tidak terduga.';
          setError(message);
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
