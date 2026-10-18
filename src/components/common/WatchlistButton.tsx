import { useWatchlist } from '../../hooks/useWatchlist';
import './WatchlistButton.css';

interface WatchlistButtonProps {
  ticker: string;
  companyName?: string;
}

/**
 * Toggle button for adding/removing a ticker from the local watchlist.
 * Per PRD.md FR-07: watchlists are for monitoring only, no trade execution
 * is implied or available here.
 */
export function WatchlistButton({ ticker, companyName }: WatchlistButtonProps) {
  const { toggle, has } = useWatchlist();
  const watched = has(ticker);

  return (
    <button
      type="button"
      className={`watchlist-btn ${watched ? 'watchlist-btn--active' : ''}`}
      onClick={() => toggle(ticker, companyName)}
      aria-pressed={watched}
    >
      <span aria-hidden="true">{watched ? '★' : '☆'}</span>
      {watched ? 'Tersimpan di Watchlist' : 'Simpan ke Watchlist'}
    </button>
  );
}
