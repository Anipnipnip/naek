import { useTheme } from '../../contexts/ThemeContext';
import { GlobalSearch } from './GlobalSearch';
import './Header.css';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header" id="main-header">
      <div className="header__left">
        <button
          className="header__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigasi"
        >
          <span className="header__menu-icon">☰</span>
        </button>

        <GlobalSearch />
      </div>

      <div className="header__right">
        <div className="header__market-status">
          <span className="header__status-dot header__status-dot--closed" />
          <span className="header__status-text">Pasar Tutup</span>
        </div>

        <button
          className="header__theme-btn"
          onClick={toggleTheme}
          aria-label={`Ganti ke ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? '☀' : '◑'}
        </button>
      </div>
    </header>
  );
}
