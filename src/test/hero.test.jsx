import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Hero from '../components/Hero.jsx';

beforeEach(() => {
  vi.useFakeTimers(); sessionStorage.clear();
  window.matchMedia.mockImplementation(query => ({ matches: false, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});
afterEach(() => { vi.useRealTimers(); sessionStorage.clear(); vi.restoreAllMocks(); });
const next = () => screen.getByRole('button', { name: 'Próxima interface' });

describe('carrossel de interfaces', () => {
  it('troca a captura e a legenda juntas e mantém somente um slide acessível', () => {
    render(<Hero navigate={vi.fn()} />);
    expect(screen.getAllByRole('group')).toHaveLength(1);
    expect(screen.getByRole('group', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getAllByRole('group')).toHaveLength(1);
    expect(screen.getByRole('group', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Painel de demonstração/ })).toHaveAttribute('src', '/images/hero/sync-mobile-1280.webp');
  });

  it('mantém a pausa ao sair do carrossel e ao remontar a página', () => {
    const view = render(<Hero navigate={vi.fn()} />);
    const region = screen.getByRole('region', { name: 'Amostras de interfaces' });
    fireEvent.click(screen.getByRole('button', { name: 'Pausar carrossel' }));
    fireEvent.focus(next());
    fireEvent.blur(next(), { relatedTarget: document.body });
    act(() => vi.advanceTimersByTime(21000));
    expect(region).toHaveAttribute('data-paused', 'true');
    expect(screen.getByRole('group', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    view.unmount();
    render(<Hero navigate={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Reproduzir carrossel' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir carrossel' }));
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole('group', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
  });

  it('oferece navegação circular manual e pausa depois da escolha por teclado', () => {
    render(<Hero navigate={vi.fn()} />);
    fireEvent.keyDown(next(), { key: 'ArrowLeft' });
    expect(screen.getByRole('group', { name: '3 de 3: Memórias a dois' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reproduzir carrossel' })).toBeInTheDocument();
    fireEvent.click(next());
    expect(screen.getByRole('group', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('group', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
  });

  it('respeita movimento reduzido sem impedir navegação manual', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    render(<Hero navigate={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Reproduzir carrossel' })).not.toBeInTheDocument();
    expect(screen.getByText(/Navegação manual · movimento reduzido/)).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(28000));
    expect(screen.getByRole('group', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    fireEvent.click(next());
    expect(screen.getByRole('group', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
  });

  it('preserva os controles quando o armazenamento da sessão está indisponível', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    render(<Hero navigate={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pausar carrossel' }));
    fireEvent.click(next());
    expect(screen.getByRole('group', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reproduzir carrossel' })).toBeInTheDocument();
  });
});
