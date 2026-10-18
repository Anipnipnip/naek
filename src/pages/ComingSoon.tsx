import { EmptyState } from '../components/common/EmptyState';
import '../components/common/PageHeader.css';

interface ComingSoonProps {
  title: string;
  description: string;
}

/**
 * Placeholder page for routes defined in navigation but not yet implemented.
 * Follows the roadmap in PRD.md: features are built incrementally, not all at once.
 * Never shows fabricated data — only an honest "not yet available" state.
 */
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="coming-soon-page">
      <div className="page-header">
        <h1 className="page-header__title">{title}</h1>
      </div>
      <EmptyState
        icon="◇"
        title="Fitur belum tersedia"
        description={description}
      />
    </div>
  );
}
