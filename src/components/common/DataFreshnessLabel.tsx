import type { FreshnessStatus } from '../../types/market';
import './DataFreshnessLabel.css';

interface DataFreshnessLabelProps {
  freshness: FreshnessStatus;
  updatedAt?: string | null;
  source?: string;
}

const FRESHNESS_LABEL: Record<FreshnessStatus, string> = {
  real_time: 'Real-time',
  delayed: 'Tertunda',
  end_of_day: 'Penutupan pasar',
  unavailable: 'Data tidak tersedia',
};

/**
 * Explicit data-freshness indicator per design.md section 8:
 * only ever shows one of the four allowed labels. Never invent a
 * "real-time" label unless the backend genuinely reports it.
 */
export function DataFreshnessLabel({ freshness, updatedAt, source }: DataFreshnessLabelProps) {
  const label = FRESHNESS_LABEL[freshness];

  const formattedTime = updatedAt
    ? new Date(updatedAt).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Jakarta',
      }) + ' WIB'
    : null;

  return (
    <span className={`freshness-label freshness-label--${freshness}`}>
      <span className="freshness-label__dot" aria-hidden="true" />
      <span className="freshness-label__text">
        {label}
        {formattedTime && <> &middot; {formattedTime}</>}
        {source && source !== 'none' && <> &middot; Sumber: {source}</>}
      </span>
    </span>
  );
}
