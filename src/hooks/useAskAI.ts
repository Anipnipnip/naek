import { useCallback, useState } from 'react';
import { apiClient, ApiError } from '../lib/apiClient';
import type { AskRequest, AskResponse } from '../types/ai';

interface UseAskAIResult {
  ask: (question: string, ticker?: string) => Promise<void>;
  response: AskResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * Sends a question to NAEK AI. This is request-triggered (not auto-fetched
 * on mount) since it represents a user action, not page data loading.
 */
export function useAskAI(): UseAskAIResult {
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(async (question: string, ticker?: string) => {
    setLoading(true);
    setError(null);
    try {
      const body: AskRequest = { question, ticker };
      const result = await apiClient.post<AskResponse>('/api/v1/ai/ask', body);
      setResponse(result);
    } catch (err) {
      setResponse(null);
      setError(err instanceof ApiError ? err.message : 'Terjadi kesalahan tidak terduga.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { ask, response, loading, error };
}
