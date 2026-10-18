import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../components/common/PageHeader.css';
import './Belajar.css';
import {
  GLOSSARY_CATEGORY_LABEL,
  GLOSSARY_TERMS,
  getGlossaryTermById,
  type GlossaryCategory,
} from '../data/glossary';
import { EmptyState } from '../components/common/EmptyState';

const CATEGORY_FILTERS: Array<{ value: GlossaryCategory | 'semua'; label: string }> = [
  { value: 'semua', label: 'Semua' },
  { value: 'dasar', label: GLOSSARY_CATEGORY_LABEL.dasar },
  { value: 'teknikal', label: GLOSSARY_CATEGORY_LABEL.teknikal },
  { value: 'fundamental', label: GLOSSARY_CATEGORY_LABEL.fundamental },
  { value: 'slang', label: GLOSSARY_CATEGORY_LABEL.slang },
];

/**
 * Belajar (Learn) page (/learn) — searchable glossary per PRD.md FR-04.
 * All content is static and bundled with the app; no backend call is
 * involved. Slang terms are visually flagged so they are never confused
 * with official exchange terminology.
 */
export function Belajar() {
  const [searchParams] = useSearchParams();
  const termFromUrl = searchParams.get('term');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryCategory | 'semua'>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(
    termFromUrl && getGlossaryTermById(termFromUrl) ? termFromUrl : null,
  );

  const filteredTerms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((term) => {
      const matchesCategory = category === 'semua' || term.category === category;
      const matchesQuery =
        normalizedQuery === '' ||
        term.term.toLowerCase().includes(normalizedQuery) ||
        term.definition.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="belajar">
      <div className="page-header">
        <h1 className="page-header__title">Belajar</h1>
        <p className="page-header__meta">
          Glosarium istilah pasar saham Indonesia dalam Bahasa Indonesia. Istilah komunitas (slang) ditandai
          jelas dan tidak disamakan dengan terminologi resmi bursa.
        </p>
      </div>

      <div className="belajar__controls">
        <input
          type="search"
          className="belajar__search"
          placeholder="Cari istilah, misalnya &quot;PER&quot; atau &quot;bid&quot;..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Cari istilah glosarium"
        />
        <div className="belajar__filters" role="group" aria-label="Filter kategori">
          {CATEGORY_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`belajar__filter-btn ${category === filter.value ? 'belajar__filter-btn--active' : ''}`}
              onClick={() => setCategory(filter.value)}
              aria-pressed={category === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTerms.length === 0 ? (
        <EmptyState
          icon="◇"
          title="Istilah tidak ditemukan"
          description="Coba kata kunci lain atau pilih kategori yang berbeda."
        />
      ) : (
        <div className="belajar__grid">
          {filteredTerms.map((term) => {
            const isExpanded = expandedId === term.id;
            return (
              <article key={term.id} className="belajar__card">
                <button
                  type="button"
                  className="belajar__card-header"
                  onClick={() => setExpandedId(isExpanded ? null : term.id)}
                  aria-expanded={isExpanded}
                >
                  <span className="belajar__card-title">
                    {term.term}
                    {term.isSlang && <span className="belajar__slang-badge">Slang</span>}
                  </span>
                  <span className="belajar__card-toggle" aria-hidden="true">
                    {isExpanded ? '−' : '+'}
                  </span>
                </button>
                <p className="belajar__card-definition">{term.definition}</p>

                {isExpanded && (
                  <div className="belajar__card-detail">
                    <div className="belajar__card-row">
                      <h3>Contoh</h3>
                      <p>{term.example}</p>
                    </div>
                    <div className="belajar__card-row">
                      <h3>Cara menafsirkan</h3>
                      <p>{term.interpretation}</p>
                    </div>
                    <div className="belajar__card-row">
                      <h3>Miskonsepsi umum</h3>
                      <p>{term.misconception}</p>
                    </div>
                    {term.relatedTermIds.length > 0 && (
                      <div className="belajar__card-row">
                        <h3>Istilah terkait</h3>
                        <div className="belajar__related">
                          {term.relatedTermIds.map((relatedId) => {
                            const related = getGlossaryTermById(relatedId);
                            if (!related) return null;
                            return (
                              <button
                                key={relatedId}
                                type="button"
                                className="belajar__related-chip"
                                onClick={() => {
                                  setExpandedId(relatedId);
                                  setQuery('');
                                  setCategory('semua');
                                }}
                              >
                                {related.term}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
