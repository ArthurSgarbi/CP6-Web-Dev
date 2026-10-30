import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import Header from '../components/Header.jsx';
import Journal from '../components/Journal.jsx';
import Footer from '../components/Footer.jsx';

it('oferece Contato no menu móvel, fecha ao navegar e devolve foco com Escape', async () => {
  const onNavigate = vi.fn();
  const user = userEvent.setup();
  render(<Header onNavigate={onNavigate} />);
  const toggle = screen.getByRole('button', { name: 'Abrir menu de navegação' });
  await user.click(toggle);
  const menu = screen.getByRole('navigation', { name: 'Navegação móvel' });
  await user.click(within(menu).getByRole('link', { name: /Contato/ }));
  expect(onNavigate).toHaveBeenCalledWith(expect.anything(), 'contato');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await user.click(toggle);
  await user.keyboard('{Escape}');
  expect(toggle).toHaveFocus();
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

it('mantém o Diário estável ao passar o mouse e alterna pelo teclado', async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><Journal /></MemoryRouter>);
  const first = screen.getByRole('button', { name: /Separar previsão/ });
  const second = screen.getByRole('button', { name: /Demonstrar sem expor/ });
  fireEvent.pointerEnter(second.closest('.editorial-item'), { pointerType: 'mouse' });
  expect(first).toHaveAttribute('aria-expanded', 'true');
  expect(second).toHaveAttribute('aria-expanded', 'false');
  second.focus();
  await user.keyboard('{Enter}');
  expect(second).toHaveAttribute('aria-expanded', 'true');
  fireEvent.pointerLeave(second.closest('.editorial-item'));
  expect(second).toHaveAttribute('aria-expanded', 'true');
  await user.keyboard(' ');
  expect(second).toHaveAttribute('aria-expanded', 'false');
});

it('usa o texto visível no nome acessível do link editorial do rodapé', () => {
  render(<MemoryRouter><Footer navigate={vi.fn()} /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Mantenha a curiosidade\s*\./ })).toHaveAttribute('href', '#work');
});
