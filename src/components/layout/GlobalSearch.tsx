import { useEffect, useRef, useState } from 'react';
import { apiClient, ApiError } from '../../lib/apiClient';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { InstrumentSearchResponse } from '../../types/instrument';
import './GlobalSearch.css';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

/**
 * Global ticker/company search in the header. Queries the backend search
 * endpoint and renders an honest empty/error state — it never fabricates
 * instrument matches on the frontend.
 */
export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InstrumentSearchResponse | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS);

  const queryTooShort = debouncedQuery.length < MIN_QUERY_LENGTH;

  useEffect(() => {
    if (queryTooShort) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiClient
      .get<InstrumentSearchResponse>(`/api/v1/instruments/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setResult(null);
          setError(err instanceof ApiError ? err.message : 'Terjadi kesalahan tidak terduga.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, queryTooShort]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = isOpen && !queryTooShort;
  const displayResult = queryTooShort ? null : result;
  const displayError = queryTooShort ? null : error;
  const displayLoading = !queryTooShort && loading;

  return (
    <div className="global-search" ref={containerRef}>
      <div className="header__search">
        <span className="header__search-icon">⌕</span>
        <input
          type="search"
          placeholder="Cari kode saham atau nama emiten..."
          className="header__search-input"
          id="global-search"
          aria-label="Cari saham"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <kbd className="header__search-kbd">/</kbd>
      </div>

      {showDropdown && (
        <div className="global-search__dropdown" role="listbox">
          {displayLoading && <div className="global-search__status">Mencari&hellip;</div>}

          {!displayLoading && displayError && (
            <div className="global-search__status global-search__status--error">{displayError}</div>
          )}

          {!displayLoading && !displayError && displayResult && displayResult.results.length === 0 && (
            <div className="global-search__status">
              {displayResult.message ?? 'Tidak ada emiten yang cocok.'}
            </div>
          )}

          {!displayLoading &&
            !displayError &&
            displayResult &&
            displayResult.results.map((item) => (
              <a
                key={`${item.exchange}:${item.ticker}`}
                href={`/saham/${item.ticker}`}
                className="global-search__item"
                role="option"
                aria-selected="false"
              >
                <span className="global-search__ticker">{item.ticker}</span>
                <span className="global-search__name">{item.company_name}</span>
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
