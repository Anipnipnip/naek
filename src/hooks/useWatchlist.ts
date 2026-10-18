import { useCallback, useEffect, useState } from 'react';
import {
  addToWatchlist,
  getWatchlist,
  isWatched,
  removeFromWatchlist,
  WATCHLIST_STORAGE_KEY,
  type WatchlistItem,
} from '../lib/watchlistStorage';

interface UseWatchlistResult {
  items: WatchlistItem[];
  add: (ticker: string, companyName?: string) => void;
  remove: (ticker: string) => void;
  toggle: (ticker: string, companyName?: string) => void;
  has: (ticker: string) => boolean;
}

/**
 * React state wrapper around localStorage-backed watchlist. Listens for the
 * `storage` event so watchlist changes made in another tab (same browser)
 * are reflected here too.
 */
export function useWatchlist(): UseWatchlistResult {
  const [items, setItems] = useState<WatchlistItem[]>(() => getWatchlist());

  useEffect(() => {
    function handleStorageEvent(event: StorageEvent) {
      if (event.key === WATCHLIST_STORAGE_KEY) {
        setItems(getWatchlist());
      }
    }
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  const add = useCallback((ticker: string, companyName?: string) => {
    setItems(addToWatchlist(ticker, companyName));
  }, []);

  const remove = useCallback((ticker: string) => {
    setItems(removeFromWatchlist(ticker));
  }, []);

  const toggle = useCallback(
    (ticker: string, companyName?: string) => {
      if (isWatched(ticker)) {
        setItems(removeFromWatchlist(ticker));
      } else {
        setItems(addToWatchlist(ticker, companyName));
      }
    },
    [],
  );

  const has = useCallback((ticker: string) => items.some((item) => item.ticker === ticker.toUpperCase()), [items]);

  return { items, add, remove, toggle, has };
}
