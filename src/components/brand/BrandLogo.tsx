import './BrandLogo.css';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  linkTo?: string;
  className?: string;
}

/**
 * Reusable BrandLogo component.
 * References /brand/naek.webp — the owner-supplied logo asset.
 * Supports multiple sizes for header, sidebar, footer, and auth placements.
 */
export function BrandLogo({ size = 'md', linkTo = '/', className = '' }: BrandLogoProps) {
  const logo = (
    <img
      src="/brand/naek.webp"
      alt="NAEK"
      className={`brand-logo brand-logo--${size} ${className}`}
    />
  );

  if (linkTo) {
    return (
      <a href={linkTo} className="brand-logo__link" aria-label="NAEK — Market Overview">
        {logo}
      </a>
    );
  }

  return logo;
}
