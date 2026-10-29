import { afterEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, act } from '@testing-library/react';
import ThemeToggle from '../components/ThemeToggle';

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  vi.restoreAllMocks();
});

it('follows the system initially and responds to system changes', () => {
  let onChange;
  const system = { matches: true, addEventListener: vi.fn((_, fn) => { onChange = fn; }), removeEventListener: vi.fn() };
  vi.spyOn(window, 'matchMedia').mockReturnValue(system);
  render(<ThemeToggle />);
  expect(document.documentElement.dataset.theme).toBe('dark');
  system.matches = false;
  act(() => onChange());
  expect(document.documentElement.dataset.theme).toBe('light');
});

it('persists a manual choice and prioritizes it over the system', () => {
  localStorage.setItem('portfolio-theme', 'dark');
  render(<ThemeToggle />);
  const button = screen.getByRole('button', { name: 'Modo escuro' });
  expect(button).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(button);
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(localStorage.getItem('portfolio-theme')).toBe('light');
});

it('allows toggling when browser storage is unavailable', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole('button', { name: 'Modo escuro' }));
  expect(document.documentElement.dataset.theme).toBe('dark');
});
