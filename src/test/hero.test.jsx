import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Hero from '../components/Hero.jsx';
import { StrictMode } from 'react';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  // Controle apenas o relógio do carrossel; mantenha a resolução real das promessas do user-event e da RTL.
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] }); sessionStorage.clear();
  window.matchMedia.mockImplementation(query => ({ matches: false, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});
afterEach(() => { vi.useRealTimers(); sessionStorage.clear(); vi.restoreAllMocks(); });
const next = () => screen.getByRole('button', { name: 'Próxima interface' });

describe('carrossel de interfaces', () => {
  it('troca a captura e a legenda juntas e mantém somente um slide acessível', () => {
    render(<Hero navigate={vi.fn()} />);
    expect(screen.getAllByRole('figure')).toHaveLength(1);
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getAllByRole('figure')).toHaveLength(1);
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
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
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    view.unmount();
    render(<Hero navigate={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Reproduzir carrossel' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir carrossel' }));
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
  });

  it('oferece navegação circular manual e pausa depois da escolha por teclado', () => {
    render(<Hero navigate={vi.fn()} />);
    fireEvent.keyDown(next(), { key: 'ArrowLeft' });
    expect(screen.getByRole('figure', { name: '3 de 3: Memórias a dois' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reproduzir carrossel' })).toBeInTheDocument();
    fireEvent.click(next());
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
  });

  it('respeita movimento reduzido sem impedir navegação manual', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    render(<Hero navigate={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Reproduzir carrossel' })).not.toBeInTheDocument();
    expect(screen.getByText(/Navegação manual · movimento reduzido/)).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(28000));
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    fireEvent.click(next());
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
  });

  it('preserva os controles quando o armazenamento da sessão está indisponível', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    render(<Hero navigate={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pausar carrossel' }));
    fireEvent.click(next());
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reproduzir carrossel' })).toBeInTheDocument();
  });

  it('suspende durante hover e reinicia um intervalo inteiro ao sair', () => {
    render(<Hero navigate={vi.fn()} />);
    const region = screen.getByRole('region', { name: 'Amostras de interfaces' });
    act(() => vi.advanceTimersByTime(6000));
    fireEvent.mouseEnter(region);
    expect(region).toHaveAttribute('data-paused', 'true');
    expect(document.getElementById('project-reel-slides')).toHaveAttribute('aria-live', 'polite');
    act(() => vi.advanceTimersByTime(21000));
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    expect(sessionStorage.getItem('portfolio-reel-paused')).toBeNull();
    fireEvent.mouseLeave(region);
    act(() => vi.advanceTimersByTime(6999));
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
    expect(document.getElementById('project-reel-slides')).toHaveAttribute('aria-live', 'off');
  });

  it('sair do hover não desfaz pausa manual nem interrupção por foco', () => {
    render(<Hero navigate={vi.fn()} />);
    const region = screen.getByRole('region', { name: 'Amostras de interfaces' });
    fireEvent.click(screen.getByRole('button', { name: 'Pausar carrossel' }));
    fireEvent.mouseEnter(region); fireEvent.mouseLeave(region);
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir carrossel' }));
    fireEvent.focus(next(), { relatedTarget: document.body });
    fireEvent.blur(next(), { relatedTarget: document.body });
    fireEvent.mouseEnter(region); fireEvent.mouseLeave(region);
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    expect(sessionStorage.getItem('portfolio-reel-paused')).toBe('true');
  });

  it.each(['{Enter}', ' '])('exige retomada explícita e permite reproduzir com %s mantendo foco', async key => {
    const user = userEvent.setup();
    render(<><Hero navigate={vi.fn()} /><input aria-label="Fora do carrossel" /></>);
    const playback = screen.getByRole('button', { name: 'Pausar carrossel' });
    act(() => playback.focus());
    expect(playback).toHaveAccessibleName('Reproduzir carrossel');
    act(() => screen.getByLabelText('Fora do carrossel').focus());
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    act(() => playback.focus());
    await user.keyboard(key);
    expect(playback).toHaveFocus();
    expect(playback).toHaveAccessibleName('Pausar carrossel');
    expect(sessionStorage.getItem('portfolio-reel-paused')).toBe('false');
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
    await user.tab(); // O foco interno não revoga a autorização explícita.
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole('figure', { name: '3 de 3: Memórias a dois' })).toBeInTheDocument();
    act(() => screen.getByLabelText('Fora do carrossel').focus());
    act(() => playback.focus());
    expect(playback).toHaveAccessibleName('Reproduzir carrossel');
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('figure', { name: '3 de 3: Memórias a dois' })).toBeInTheDocument();
  });

  it('o clique em Pausar mantém sua intenção mesmo quando o foco muda antes do click', async () => {
    const user = userEvent.setup();
    render(<Hero navigate={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Pausar carrossel' }));
    await user.unhover(screen.getByRole('region', { name: 'Amostras de interfaces' }));
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('button', { name: 'Reproduzir carrossel' })).toHaveFocus();
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reproduzir carrossel' }));
    act(() => vi.advanceTimersByTime(14000)); // O cursor ainda está sobre o elemento.
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    await user.unhover(screen.getByRole('region', { name: 'Amostras de interfaces' }));
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
  });

  it('suspende em aba oculta e não desfaz uma pausa quando volta a ficar visível', () => {
    let hidden = true;
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
    render(<Hero navigate={vi.fn()} />);
    const visibility = value => {
      hidden = value;
      fireEvent(document, new Event('visibilitychange'));
    };
    act(() => vi.advanceTimersByTime(21000));
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    visibility(false);
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
    visibility(true);
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Pausar carrossel' }));
    visibility(false);
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
  });

  it('reage à preferência de movimento e limpa timers e listeners em StrictMode', () => {
    const preference = new EventTarget();
    preference.matches = false;
    window.matchMedia.mockReturnValue(preference);
    const motionAdd = vi.spyOn(preference, 'addEventListener');
    const motionRemove = vi.spyOn(preference, 'removeEventListener');
    const visibilityAdd = vi.spyOn(document, 'addEventListener');
    const visibilityRemove = vi.spyOn(document, 'removeEventListener');
    const view = render(<StrictMode><Hero navigate={vi.fn()} /></StrictMode>);
    expect(vi.getTimerCount()).toBe(1);
    act(() => { preference.matches = true; preference.dispatchEvent(new Event('change')); });
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole('figure', { name: '1 de 3: Meu Caixa' })).toBeInTheDocument();
    act(() => { preference.matches = false; preference.dispatchEvent(new Event('change')); });
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole('figure', { name: '2 de 3: SYNC Mobile' })).toBeInTheDocument();
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
    for (const [type, listener] of motionAdd.mock.calls) expect(motionRemove).toHaveBeenCalledWith(type, listener);
    for (const [type, listener] of visibilityAdd.mock.calls.filter(([type]) => type === 'visibilitychange')) {
      expect(visibilityRemove).toHaveBeenCalledWith(type, listener);
    }
  });
});
