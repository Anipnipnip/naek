/**
 * Watchlist persistence via localStorage.
 *
 * Design note: NAEK has no user account/authentication system yet (see
 * PRD.md FR-07 — "Optional account support may sync watchlists across
 * devices"). Until accounts exist, the watchlist is local to the browser
 * only. This module never talks to the backend; it is purely client-side
 * state, consistent with "watchlists are for monitoring only and do not
 * execute trades."
 */

const STORAGE_KEY = 'naek-watchlist';

export interface WatchlistItem {
  ticker: string;
  companyName?: string;
  addedAt: string; // ISO 8601
}

function readRaw(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is WatchlistItem => typeof item?.ticker === 'string' && typeof item?.addedAt === 'string',
    );
  } catch {
    // Corrupted or inaccessible storage — treat as empty rather than throwing.
    return [];
  }
}

function writeRaw(items: WatchlistItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full/unavailable (e.g. private browsing). Fail silently —
    // the in-memory React state still reflects the attempted change for
    // this session, but it won't persist. Not fatal to the app.
  }
}

export function getWatchlist(): WatchlistItem[] {
  return readRaw().sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

export function isWatched(ticker: string): boolean {
  const normalized = ticker.toUpperCase();
  return readRaw().some((item) => item.ticker === normalized);
}

export function addToWatchlist(ticker: string, companyName?: string): WatchlistItem[] {
  const normalized = ticker.toUpperCase();
  const items = readRaw();
  if (items.some((item) => item.ticker === normalized)) {
    return items;
  }
  const next = [...items, { ticker: normalized, companyName, addedAt: new Date().toISOString() }];
  writeRaw(next);
  return next;
}

export function removeFromWatchlist(ticker: string): WatchlistItem[] {
  const normalized = ticker.toUpperCase();
  const next = readRaw().filter((item) => item.ticker !== normalized);
  writeRaw(next);
  return next;
}

export const WATCHLIST_STORAGE_KEY = STORAGE_KEY;
