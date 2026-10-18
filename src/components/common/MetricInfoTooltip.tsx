import { useState } from 'react';
import { Link } from 'react-router-dom';
import './MetricInfoTooltip.css';

interface MetricInfoTooltipProps {
  label: string;
  formula: string;
  /** Optional glossary term id (see src/data/glossary.ts) to link to Belajar page. */
  glossaryId?: string;
}

/**
 * Inline info affordance for financial ratios (PER, PBV, ROE, etc.).
 * Per design.md 7.3: always show the formula/methodology behind a derived
 * metric rather than presenting a bare number. Click-to-toggle rather than
 * hover-only, so the explanation is reachable via keyboard too.
 */
export function MetricInfoTooltip({ label, formula, glossaryId }: MetricInfoTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="metric-info-tooltip">
      <button
        type="button"
        className="metric-info-tooltip__trigger"
        aria-expanded={open}
        aria-label={`Lihat formula ${label}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        ⓘ
      </button>
      {open && (
        <span className="metric-info-tooltip__popover" role="tooltip">
          <strong>{label}</strong>
          <span>{formula}</span>
          {glossaryId && (
            <Link to={`/learn?term=${glossaryId}`} className="metric-info-tooltip__link">
              Pelajari arti {label}
            </Link>
          )}
        </span>
      )}
    </span>
  );
}
