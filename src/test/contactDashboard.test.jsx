import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage.jsx';
it('consulta com token, mostra conteúdo e remove dados ao sair', async () => {
  const fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'test-session' }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ messages: [{ id: '1', name: 'Visitante', email: 'teste@example.com', subject: 'Projeto novo', message: 'Mensagem completa de teste para consulta administrativa.', status: 'new', email_status: 'failed', created_at: '2026-10-27T12:00:00Z' }] }) });
  vi.stubGlobal('fetch', fetch); const user = userEvent.setup();
  render(<MemoryRouter><DashboardPage /></MemoryRouter>);
  expect(screen.queryByText('Projeto novo')).not.toBeInTheDocument();
  await user.type(screen.getByLabelText('E-mail'), 'admin@example.com');
  await user.type(screen.getByLabelText('Senha'), 'test-password');
  await user.click(screen.getByRole('button', { name: 'Entrar', exact: true }));
  await screen.findByRole('heading', { name: 'Projeto novo' });
  expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer test-session');
  await user.click(screen.getByText('Ver mensagem completa'));
  expect(screen.getByText(/Status: new · E-mail: falhou/)).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Sair', exact: true }));
  expect(screen.queryByText('Projeto novo')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible();
});
it('não expõe mensagens quando autenticação falha', async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) });
  vi.stubGlobal('fetch', fetch); const user = userEvent.setup();
  render(<MemoryRouter><DashboardPage /></MemoryRouter>);
  await user.type(screen.getByLabelText('E-mail'), 'visitor@example.com');
  await user.type(screen.getByLabelText('Senha'), 'test-password');
  await user.click(screen.getByRole('button', { name: 'Entrar', exact: true }));
  await screen.findByText(/Não foi possível acessar as mensagens/);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(screen.queryByText('Ver mensagem completa')).not.toBeInTheDocument();
});
