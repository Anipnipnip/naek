import { NavLink, useLocation } from 'react-router-dom';
import { BrandLogo } from '../brand/BrandLogo';
import './Sidebar.css';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  children?: { label: string; path: string; icon: string }[];
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/', icon: '◈' },
  { label: 'Saham', path: '/saham', icon: '◆' },
  { label: 'Screener', path: '/screener', icon: '⊞' },
  { label: 'Compare', path: '/compare', icon: '⇔' },
  { label: 'Watchlist', path: '/watchlist', icon: '☆' },
  { label: 'Berita', path: '/berita', icon: '▤' },
  {
    label: 'Intelligence',
    path: '/intelligence',
    icon: '◉',
    children: [
      { label: 'Bullish / Bearish', path: '/intelligence/radar', icon: '↕' },
      { label: 'Multibagger Watch', path: '/intelligence/multibagger', icon: '▲' },
      { label: 'IHSG Risk', path: '/intelligence/ihsg-risk', icon: '⚠' },
    ],
  },
  { label: 'NAEK AI', path: '/ai', icon: '✦' },
  { label: 'Learn', path: '/learn', icon: '◇' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const isIntelligenceActive = location.pathname.startsWith('/intelligence');

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <BrandLogo size="md" linkTo="/" />
        </div>

        <nav className="sidebar__nav" aria-label="Navigasi utama">
          <ul className="sidebar__list">
            {navItems.map((item) => (
              <li key={item.path} className="sidebar__item">
                {item.children ? (
                  <>
                    <div
                      className={`sidebar__link sidebar__link--group ${isIntelligenceActive ? 'sidebar__link--active' : ''}`}
                    >
                      <span className="sidebar__icon">{item.icon}</span>
                      <span className="sidebar__label">{item.label}</span>
                    </div>
                    <ul className="sidebar__sublist">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `sidebar__link sidebar__link--sub ${isActive ? 'sidebar__link--active' : ''}`
                            }
                            onClick={onClose}
                          >
                            <span className="sidebar__icon sidebar__icon--sub">{child.icon}</span>
                            <span className="sidebar__label">{child.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                    }
                    onClick={onClose}
                  >
                    <span className="sidebar__icon">{item.icon}</span>
                    <span className="sidebar__label">{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <a href="/about" className="sidebar__link sidebar__link--footer" onClick={onClose}>
            <span className="sidebar__icon">⚬</span>
            <span className="sidebar__label">Open Source</span>
          </a>
          <div className="sidebar__version">v0.1.0 — MVP</div>
        </div>
      </aside>
    </>
  );
}
