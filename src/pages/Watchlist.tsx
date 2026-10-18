import { Link } from 'react-router-dom';
import '../components/common/PageHeader.css';
import '../pages/MarketOverview.css';
import { useWatchlist } from '../hooks/useWatchlist';
import { EmptyState } from '../components/common/EmptyState';

/**
 * Watchlist page (/watchlist). Lists tickers the user has saved locally.
 * Per PRD.md FR-07: monitoring only, no trade execution. Stored in the
 * browser via localStorage — not synced across devices since NAEK has no
 * account system yet.
 */
export function Watchlist() {
  const { items, remove } = useWatchlist();

  return (
    <div className="market-overview" id="page-watchlist">
      <div className="page-header">
        <h1 className="page-header__title">Watchlist</h1>
        <p className="page-header__meta">
          Daftar ini tersimpan di perangkat ini saja. Belum ada fitur akun untuk sinkronisasi antar perangkat.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="☆"
          title="Watchlist masih kosong"
          description="Buka halaman detail saham lalu klik \u201cSimpan ke Watchlist\u201d untuk menambahkan emiten di sini."
        />
      ) : (
        <section className="mo-section" aria-label="Daftar Watchlist">
          <div className="mo-table-wrapper">
            <table className="mo-table">
              <thead>
                <tr>
                  <th className="mo-table__th">Kode</th>
                  <th className="mo-table__th">Nama Perusahaan</th>
                  <th className="mo-table__th">Ditambahkan</th>
                  <th className="mo-table__th mo-table__th--right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.ticker}>
                    <td>
                      <Link to={`/saham/${item.ticker}`}>{item.ticker}</Link>
                    </td>
                    <td>{item.companyName ?? '—'}</td>
                    <td>
                      {new Date(item.addedAt).toLocaleDateString('id-ID', {
                        dateStyle: 'medium',
                      })}
                    </td>
                    <td className="mo-table__th--right">
                      <button type="button" className="watchlist-remove-btn" onClick={() => remove(item.ticker)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
