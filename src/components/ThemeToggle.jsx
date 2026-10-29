import { useEffect, useState } from 'react';

const storageKey = 'portfolio-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (next) => {
      document.documentElement.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#171a16' : '#f3f2ed');
      setTheme(next);
    };
    const storedTheme = () => {
      try { return localStorage.getItem(storageKey); } catch { return null; }
    };
    const sync = () => {
      const saved = storedTheme();
      apply(saved === 'light' || saved === 'dark' ? saved : system.matches ? 'dark' : 'light');
    };
    const onStorage = (event) => {
      if (event.key === storageKey || event.key === null) sync();
    };
    sync();
    system.addEventListener('change', sync);
    window.addEventListener('storage', onStorage);
    return () => {
      system.removeEventListener('change', sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(storageKey, next); } catch { /* Keep the toggle usable without storage. */ }
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#171a16' : '#f3f2ed');
    setTheme(next);
  };

  return (
    <button className="theme-toggle" type="button" onClick={toggle}
      aria-label="Modo escuro" aria-pressed={theme === 'dark'}
      title={`Ativar modo ${theme === 'dark' ? 'claro' : 'escuro'}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        {theme === 'dark'
          ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>
          : <path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z" />}
      </svg>
    </button>
  );
}
