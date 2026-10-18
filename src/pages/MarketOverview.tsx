import '../components/common/PageHeader.css';
import './MarketOverview.css';
import { useMarketOverview } from '../hooks/useMarketOverview';
import { DataFreshnessLabel } from '../components/common/DataFreshnessLabel';
import { EmptyState } from '../components/common/EmptyState';

/**
 * Market Overview page — the main dashboard.
 * Shows index summary, market breadth, sector performance, top movers, and news.
 * Data is fetched live from the Golang backend (GET /api/v1/market/overview).
 * As long as no market-data provider is configured on the backend, this page
 * honestly renders an "unavailable" state instead of fabricating numbers.
 */
export function MarketOverview() {
  const { data, loading, error } = useMarketOverview();

  const freshness = data?.freshness ?? 'unavailable';
  const hasIndices = (data?.indices.length ?? 0) > 0;

  return (
    <div className="market-overview" id="page-market-overview">
      <div className="page-header">
        <div className="page-header__title-row">
          <h1 className="page-header__title">Market Overview</h1>
        </div>
        <DataFreshnessLabel freshness={freshness} updatedAt={data?.updated_at} source={data?.source} />
      </div>

      {loading && (
        <section className="mo-section" aria-live="polite">
          <p className="text-muted">Memuat data pasar&hellip;</p>
        </section>
      )}

      {!loading && error && (
        <section className="mo-section" aria-label="Gagal memuat data">
          <EmptyState
            icon="⚠"
            title="Gagal memuat data pasar"
            description={error}
          />
        </section>
      )}

      {!loading && !error && !hasIndices && (
        <section className="mo-section" aria-label="Data pasar belum tersedia">
          <EmptyState
            icon="◇"
            title="Data pasar belum tersedia"
            description={
              data?.message ??
              'Belum ada sumber data pasar yang terhubung ke NAEK. Konfigurasikan penyedia data untuk menampilkan ringkasan pasar.'
            }
          />
        </section>
      )}

      {!loading && !error && hasIndices && (
        <section className="mo-section" aria-label="Ringkasan Indeks">
          <div className="mo-index-grid">
            {data!.indices.map((index) => (
              <div className="mo-index-card" key={index.code}>
                <div className="mo-index-card__header">
                  <span className="mo-index-card__name">{index.name}</span>
                  <span className="mo-index-card__status">{index.freshness}</span>
                </div>
                <div className="mo-index-card__value tabular-nums">
                  {index.value !== null ? index.value.toLocaleString('id-ID') : '—'}
                </div>
                <div className="mo-index-card__change">
                  <span className="mo-index-card__delta">
                    {index.change !== null ? index.change.toLocaleString('id-ID', { signDisplay: 'always' }) : '—'}
                  </span>
                  <span className="mo-index-card__pct">
                    {index.change_percent !== null
                      ? `${index.change_percent.toLocaleString('id-ID', { signDisplay: 'always' })}%`
                      : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Market Breadth, Top Gainers/Losers, Sector Performance: shown only when
          the backend provides real data for them. Not implemented in this stage
          since no provider is connected yet (see provider.NoopProvider). */}

      {/* Quick Access */}
      <section className="mo-section" aria-label="Akses Cepat">
        <h2 className="mo-section__title">Akses Cepat</h2>
        <div className="mo-quick-grid">
          <a href="/ai" className="mo-quick-card">
            <span className="mo-quick-card__icon">✦</span>
            <span className="mo-quick-card__label">NAEK AI</span>
            <span className="mo-quick-card__desc">Tanya tentang pasar</span>
          </a>
          <a href="/intelligence/radar" className="mo-quick-card">
            <span className="mo-quick-card__icon">↕</span>
            <span className="mo-quick-card__label">Radar Sinyal</span>
            <span className="mo-quick-card__desc">Bullish & Bearish</span>
          </a>
          <a href="/intelligence/ihsg-risk" className="mo-quick-card">
            <span className="mo-quick-card__icon">⚠</span>
            <span className="mo-quick-card__label">IHSG Risk</span>
            <span className="mo-quick-card__desc">Pantau risiko pasar</span>
          </a>
          <a href="/learn" className="mo-quick-card">
            <span className="mo-quick-card__icon">◇</span>
            <span className="mo-quick-card__label">Belajar</span>
            <span className="mo-quick-card__desc">Istilah & konsep saham</span>
          </a>
        </div>
      </section>
    </div>
  );
}
