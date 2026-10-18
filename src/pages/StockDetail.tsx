import { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../components/common/PageHeader.css';
import './StockDetail.css';
import { useInstrumentDetail } from '../hooks/useInstrumentDetail';
import { useOHLCV } from '../hooks/useOHLCV';
import { useFundamentals } from '../hooks/useFundamentals';
import { DataFreshnessLabel } from '../components/common/DataFreshnessLabel';
import { EmptyState } from '../components/common/EmptyState';
import { MetricInfoTooltip } from '../components/common/MetricInfoTooltip';
import { WatchlistButton } from '../components/common/WatchlistButton';
import type { OHLCVRange } from '../types/instrumentDetail';
import type { PeriodType } from '../types/fundamentals';

const RANGE_OPTIONS: OHLCVRange[] = ['1M', '3M', '6M', '1Y', '5Y'];
const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: 'annual', label: 'Tahunan' },
  { value: 'quarterly', label: 'Kuartalan' },
];

/**
 * Stock Explorer detail page (/saham/:ticker).
 * Shows company identity, latest price snapshot, and a historical price
 * chart area. All data is fetched live from the backend; while no market
 * data or historical data source is configured, this page renders honest
 * empty states instead of fabricated prices or charts.
 */
export function StockDetail() {
  const { ticker } = useParams<{ ticker: string }>();
  const [range, setRange] = useState<OHLCVRange>('1M');
  const [periodType, setPeriodType] = useState<PeriodType>('annual');

  const { data: detail, loading: detailLoading, error: detailError, notFound } = useInstrumentDetail(ticker);
  const { data: series, loading: seriesLoading, error: seriesError } = useOHLCV(ticker, range);
  const { data: fundamentals, loading: fundamentalsLoading, error: fundamentalsError } = useFundamentals(
    ticker,
    periodType,
  );

  if (!ticker) {
    return (
      <div className="stock-detail">
        <EmptyState icon="⚠" title="Ticker tidak valid" description="Tidak ada kode saham yang ditentukan." />
      </div>
    );
  }

  if (detailLoading) {
    return (
      <div className="stock-detail">
        <p className="text-muted">Memuat data emiten&hellip;</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="stock-detail">
        <div className="page-header">
          <h1 className="page-header__title">{ticker}</h1>
        </div>
        <EmptyState
          icon="◇"
          title="Emiten tidak ditemukan"
          description="Belum ada data emiten yang terhubung ke NAEK untuk ticker ini. Fitur pencarian saham masih dalam pengembangan bertahap."
        />
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="stock-detail">
        <div className="page-header">
          <h1 className="page-header__title">{ticker}</h1>
        </div>
        <EmptyState icon="⚠" title="Gagal memuat data emiten" description={detailError} />
      </div>
    );
  }

  const price = detail?.latest_price ?? null;
  const hasBars = (series?.bars.length ?? 0) > 0;

  return (
    <div className="stock-detail">
      <div className="page-header">
        <div className="page-header__title-row">
          <h1 className="page-header__title">{detail?.company_name ?? ticker}</h1>
          <span className="stock-detail__ticker-badge">{detail?.ticker ?? ticker}</span>
        </div>
        <p className="page-header__meta">
          {detail?.exchange ?? '—'}
          {detail?.sector ? ` · ${detail.sector}` : ''}
        </p>
        {detail && (
          <DataFreshnessLabel freshness={detail.freshness} source={detail.source} updatedAt={price?.observed_at} />
        )}
        <WatchlistButton ticker={detail?.ticker ?? ticker} companyName={detail?.company_name} />
      </div>

      {/* Price summary */}
      <section className="stock-detail__section" aria-label="Ringkasan Harga">
        {price ? (
          <div className="stock-detail__price-card">
            <div className="stock-detail__price-value tabular-nums">
              {price.value !== null ? price.value.toLocaleString('id-ID') : '—'}
            </div>
            <div className="stock-detail__price-change">
              <span>
                {price.change !== null ? price.change.toLocaleString('id-ID', { signDisplay: 'always' }) : '—'}
              </span>
              <span>
                {price.change_percent !== null
                  ? `${price.change_percent.toLocaleString('id-ID', { signDisplay: 'always' })}%`
                  : '—'}
              </span>
            </div>
          </div>
        ) : (
          <EmptyState
            icon="◇"
            title="Harga belum tersedia"
            description="Belum ada sumber data harga yang terhubung untuk emiten ini."
          />
        )}
      </section>

      {/* Historical chart area */}
      <section className="stock-detail__section" aria-label="Grafik Historis">
        <div className="stock-detail__chart-header">
          <h2 className="mo-section__title">Grafik Historis</h2>
          <div className="stock-detail__range-selector" role="group" aria-label="Pilih rentang waktu">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`stock-detail__range-btn ${range === option ? 'stock-detail__range-btn--active' : ''}`}
                onClick={() => setRange(option)}
                aria-pressed={range === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {series && (
          <DataFreshnessLabel freshness={series.freshness} source={series.source} />
        )}

        <div className="stock-detail__chart-area">
          {seriesLoading && <p className="text-muted">Memuat data historis&hellip;</p>}

          {!seriesLoading && seriesError && (
            <EmptyState icon="⚠" title="Gagal memuat data historis" description={seriesError} />
          )}

          {!seriesLoading && !seriesError && !hasBars && (
            <EmptyState
              icon="◇"
              title="Data historis belum tersedia"
              description={
                series?.message ??
                'Belum ada sumber data historis yang terhubung ke NAEK. Grafik akan muncul setelah sumber data historis dikonfigurasi.'
              }
            />
          )}

          {!seriesLoading && !seriesError && hasBars && (
            <p className="text-muted">
              {series!.bars.length} bar data historis tersedia (visualisasi grafik akan ditambahkan pada tahap berikutnya).
            </p>
          )}
        </div>
      </section>

      {/* Fundamental */}
      <section className="stock-detail__section" aria-label="Fundamental">
        <div className="stock-detail__chart-header">
          <h2 className="mo-section__title">Fundamental</h2>
          <div className="stock-detail__range-selector" role="group" aria-label="Pilih periode laporan">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`stock-detail__range-btn ${
                  periodType === option.value ? 'stock-detail__range-btn--active' : ''
                }`}
                onClick={() => setPeriodType(option.value)}
                aria-pressed={periodType === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {fundamentals && (
          <DataFreshnessLabel freshness={fundamentals.freshness} source={fundamentals.source} />
        )}

        {fundamentalsLoading && <p className="text-muted">Memuat data fundamental&hellip;</p>}

        {!fundamentalsLoading && fundamentalsError && (
          <EmptyState icon="⚠" title="Gagal memuat data fundamental" description={fundamentalsError} />
        )}

        {!fundamentalsLoading && !fundamentalsError && (fundamentals?.metrics.length ?? 0) === 0 && (
          <EmptyState
            icon="◇"
            title="Data fundamental belum tersedia"
            description={
              fundamentals?.message ??
              'Belum ada sumber data fundamental yang terhubung ke NAEK. Laporan keuangan akan muncul setelah sumber data dikonfigurasi.'
            }
          />
        )}

        {!fundamentalsLoading && !fundamentalsError && (fundamentals?.metrics.length ?? 0) > 0 && (
          <div className="stock-detail__fundamental-grid">
            <div className="stock-detail__fundamental-table-wrapper">
              <table className="stock-detail__fundamental-table">
                <thead>
                  <tr>
                    <th>Metrik</th>
                    <th className="stock-detail__col-right">Periode</th>
                    <th className="stock-detail__col-right">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {fundamentals!.metrics.map((metric) => (
                    <tr key={`${metric.name}-${metric.fiscal_year}-${metric.fiscal_quarter ?? 'FY'}`}>
                      <td>{metric.label}</td>
                      <td className="stock-detail__col-right">
                        {metric.fiscal_quarter ? `Q${metric.fiscal_quarter} ` : ''}
                        {metric.fiscal_year}
                      </td>
                      <td className="stock-detail__col-right tabular-nums">
                        {metric.value.toLocaleString('id-ID')} {metric.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {fundamentals!.ratios.length > 0 && (
              <div className="stock-detail__fundamental-table-wrapper">
                <table className="stock-detail__fundamental-table">
                  <thead>
                    <tr>
                      <th>Rasio</th>
                      <th className="stock-detail__col-right">Periode</th>
                      <th className="stock-detail__col-right">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundamentals!.ratios.map((ratio) => (
                      <tr key={`${ratio.name}-${ratio.fiscal_year}-${ratio.fiscal_quarter ?? 'FY'}`}>
                        <td>
                          {ratio.label}
                          <MetricInfoTooltip label={ratio.label} formula={ratio.formula} glossaryId={ratio.name} />
                        </td>
                        <td className="stock-detail__col-right">
                          {ratio.fiscal_quarter ? `Q${ratio.fiscal_quarter} ` : ''}
                          {ratio.fiscal_year}
                        </td>
                        <td className="stock-detail__col-right tabular-nums">
                          {ratio.value.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
