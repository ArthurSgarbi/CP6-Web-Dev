import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';

const links = [
  { id: 'work', label: 'Trabalhos', index: '01' },
  { id: 'exploration', label: 'Processo', index: '02' },
  { id: 'journal', label: 'Diário', index: '03' },
];

export default function Header({ activeSection, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    let accumulatedDelta = 0;

    const updateVisibility = () => {
      const currentY = Math.max(0, Math.min(window.scrollY,
        document.documentElement.scrollHeight - window.innerHeight));
      const delta = currentY - previousY;
      previousY = currentY;

      if (currentY <= 0) {
        accumulatedDelta = 0;
        setHeaderHidden(false);
        return;
      }

      // Ignore small scroll jitter, but react promptly when direction changes.
      if (Math.sign(delta) !== Math.sign(accumulatedDelta)) accumulatedDelta = 0;
      accumulatedDelta += delta;
      if (Math.abs(accumulatedDelta) < 6) return;

      setHeaderHidden(accumulatedDelta > 0 && !menuOpen
        && !headerRef.current?.contains(document.activeElement));
      accumulatedDelta = 0;
    };

    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const dismissOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const dismissWithEscape = (event) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissWithEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('keydown', dismissWithEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(width > 800px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  const followAnchor = (event, id) => {
    setMenuOpen(false);
    onNavigate(event, id);
  };

  return (
    <header
      className={`site-header${menuOpen ? ' is-open' : ''}${headerHidden ? ' is-hidden' : ''}`}
      ref={headerRef}
      onFocusCapture={() => setHeaderHidden(false)}
    >
      <div className="header-inner">
        <a className="brand" href="#top" onClick={(event) => followAnchor(event, 'top')} aria-label="Explorações de design — voltar ao topo">
          <svg className="brand-symbol" viewBox="0 0 36 36" fill="none" aria-hidden="true" focusable="false">
            <path d="M2 2h14v14H2zM20 2h14v14H20zM2 20h14v14H2z" fill="currentColor" />
            <circle cx="27" cy="27" r="7" fill="currentColor" />
          </svg>
          <span className="brand-name">EXPLORAÇÕES<br />DE DESIGN</span>
        </a>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(({ id, label, index }) => (
            <a
              className="nav-link"
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? 'location' : undefined}
              onClick={(event) => followAnchor(event, id)}
            >
              <span className="nav-index" aria-hidden="true">{index}</span>
              {label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#contato" onClick={(event) => followAnchor(event, 'contato')}>
          Entre em contato <Icon />
        </a>

        <ThemeToggle />

        <button
          className="menu-toggle"
          type="button"
          ref={toggleRef}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? 'Fechar' : 'Menu'}</span>
          <span className="menu-toggle-lines" aria-hidden="true"><span /><span /></span>
        </button>
      </div>

      <nav className="mobile-navigation" id="mobile-navigation" aria-label="Navegação móvel" hidden={!menuOpen}>
        {links.map(({ id, label, index }) => (
          <a
            className="mobile-nav-link"
            key={id}
            href={`#${id}`}
            aria-current={activeSection === id ? 'location' : undefined}
            onClick={(event) => followAnchor(event, id)}
          >
            <span className="mobile-nav-index">{index}</span>
            <span>{label}</span>
            <Icon />
          </a>
        ))}
      </nav>
    </header>
  );
}
