import { useState } from 'react';
import '../components/common/PageHeader.css';
import './NaekAI.css';
import { useAskAI } from '../hooks/useAskAI';
import { EmptyState } from '../components/common/EmptyState';

const SUGGESTED_PROMPTS = [
  'Kenapa saham ini turun hari ini?',
  'Jelaskan PER dengan contoh.',
  'Apa itu market breadth?',
  'Bagaimana cara membaca grafik candlestick?',
];

const ANSWER_SECTIONS: { key: 'summary' | 'data_observed' | 'interpretation' | 'alternative_scenarios' | 'risks_and_limitations' | 'what_to_watch'; label: string }[] = [
  { key: 'summary', label: 'Ringkasan' },
  { key: 'data_observed', label: 'Data yang terlihat' },
  { key: 'interpretation', label: 'Interpretasi' },
  { key: 'alternative_scenarios', label: 'Skenario alternatif' },
  { key: 'risks_and_limitations', label: 'Risiko dan batasan' },
  { key: 'what_to_watch', label: 'Apa yang perlu dipantau' },
];

/**
 * NAEK AI research-assistant page (/ai).
 * Per design.md 7.6: feels like a research assistant, not a fortune teller.
 * Separates facts, interpretation, and uncertainty into distinct sections.
 * While no AI provider is configured on the backend, this page renders an
 * honest "not available yet" state instead of a fabricated answer.
 */
export function NaekAI() {
  const [question, setQuestion] = useState('');
  const { ask, response, loading, error } = useAskAI();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    void ask(trimmed);
  }

  return (
    <div className="naek-ai">
      <div className="page-header">
        <h1 className="page-header__title">NAEK AI</h1>
        <p className="page-header__meta">
          Asisten riset berbasis data yang tersedia. NAEK AI tidak menjamin hasil, tidak memberi rekomendasi
          beli/jual, dan selalu menyebutkan sumber serta ketidakpastian.
        </p>
      </div>

      <form className="naek-ai__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="naek-ai__input"
          placeholder="Tanyakan sesuatu tentang pasar atau istilah saham..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          aria-label="Pertanyaan untuk NAEK AI"
        />
        <button type="submit" className="naek-ai__submit" disabled={loading || !question.trim()}>
          {loading ? 'Mengirim...' : 'Tanya'}
        </button>
      </form>

      <div className="naek-ai__prompts">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="naek-ai__prompt-chip"
            onClick={() => setQuestion(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Memproses pertanyaan&hellip;</p>}

      {!loading && error && (
        <EmptyState icon="⚠" title="Gagal menghubungi NAEK AI" description={error} />
      )}

      {!loading && !error && response && !response.available && (
        <EmptyState
          icon="◇"
          title="NAEK AI belum tersedia"
          description={
            response.message ??
            'Asisten riset AI belum terhubung ke penyedia AI mana pun. Fitur ini akan aktif setelah konfigurasi provider selesai.'
          }
        />
      )}

      {!loading && !error && response?.available && response.answer && (
        <div className="naek-ai__answer">
          {ANSWER_SECTIONS.map((section) => (
            <section key={section.key} className="naek-ai__answer-section" aria-label={section.label}>
              <h2 className="mo-section__title">{section.label}</h2>
              <p>{response.answer![section.key] || '—'}</p>
            </section>
          ))}

          {response.answer.sources.length > 0 && (
            <section className="naek-ai__answer-section" aria-label="Sumber">
              <h2 className="mo-section__title">Sumber</h2>
              <ul className="naek-ai__sources">
                {response.answer.sources.map((source, idx) => (
                  <li key={idx}>
                    {source.url ? (
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.label}
                      </a>
                    ) : (
                      source.label
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
