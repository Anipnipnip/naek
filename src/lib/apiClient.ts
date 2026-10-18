/**
 * Centralized API client for talking to the NAEK Go backend.
 *
 * Design rules (see PRD.md / design.md):
 * - Never fabricate data on the frontend. If a request fails or the backend
 *   reports unavailable data, surface that honestly to the UI.
 * - All responses are expected to carry freshness/source metadata where
 *   relevant; this client does not strip or alter that metadata.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    // Network failure (backend down, CORS issue, offline, etc.)
    throw new ApiError('Tidak dapat terhubung ke server NAEK. Periksa koneksi atau coba lagi nanti.', 0);
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = typeof body?.error === 'string' ? body.error : '';
    } catch {
      // ignore body parse failure
    }
    throw new ApiError(detail || `Permintaan gagal (status ${response.status}).`, response.status);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      body: JSON.stringify(body),
    }),
};
