import { expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App.jsx';
import { repository, jsonResponse } from './fixtures.js';
let loggedIn, expired, failUpdate, failSave, rows, selected, client, router;
const id = '11111111-1111-4111-8111-111111111111';
beforeEach(() => {
  loggedIn = false; expired = false; failUpdate = false; failSave = false;
  rows = [{ id, name: 'Visitante', email: 'teste@example.com', subject: 'Projeto novo', message: 'Mensagem completa para consulta administrativa.', status: 'new', email_status: 'failed', created_at: '2026-10-27T12:00:00Z' }];
  selected = ['meu-caixa'];
  vi.stubGlobal('fetch', vi.fn(async (path, options = {}) => {
    if (path.startsWith('https://api.github.com')) return jsonResponse(Array.from({ length: 5 }, (_, i) => repository({ id: i + 1, name: i === 0 ? 'meu-caixa' : `projeto-${i}` })));
    const projects = () => selected.map((repository_name, position) => ({ repository_name, position }));
    if (path === '/api/featured') return jsonResponse({ projects: projects() });
    const url = new URL(path, 'http://localhost');
    const resource = url.searchParams.get('resource');
    if (resource === 'session' && options.method === 'POST') {
      const body = JSON.parse(options.body);
      if (body.password === 'invalid') return jsonResponse({}, 401);
      if (body.email === 'visitor@example.com') return jsonResponse({}, 403);
      loggedIn = true; return jsonResponse({ user: { email: body.email } });
    }
    if (!loggedIn || expired) return jsonResponse({}, 401);
    if (resource === 'session') { if (options.method === 'DELETE') loggedIn = false; return jsonResponse({ user: { email: 'arthursgarbi037@gmail.com' } }); }
    if (resource === 'featured') {
      if (options.method === 'PUT') { if (failSave) return jsonResponse({}, 503); selected = JSON.parse(options.body).repositories; }
      return jsonResponse({ projects: projects() });
    }
    if (options.method === 'PATCH') { if (failUpdate) return jsonResponse({}, 503); rows[0] = { ...rows[0], ...JSON.parse(options.body) }; return jsonResponse({ message: rows[0] }); }
    const status = url.searchParams.get('status');
    return jsonResponse({ messages: rows.filter(row => !status || row.status === status), counts: { new: rows.filter(row => row.status === 'new').length, responded: rows.filter(row => row.status === 'responded').length } });
  }));
});
afterEach(() => { client?.clear(); router?.dispose(); });
function start(path = '/dashboard') {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  router = createMemoryRouter([{ path: '*', element: <App /> }], { initialEntries: [path] });
  render(<QueryClientProvider client={client}><RouterProvider router={router} /></QueryClientProvider>);
  return userEvent.setup();
}
async function signIn(user, password = 'test-password') {
  const email = await screen.findByLabelText('E-mail');
  if (!email.value) await user.type(email, 'administrador@example.invalid');
  await user.type(await screen.findByLabelText('Senha'), password);
  await user.click(screen.getByRole('button', { name: /Entrar/ }));
}
it('redireciona visitante e permite login, logout e teclado', async () => {
  const user = start();
  await screen.findByLabelText('Senha');
  expect(screen.getByLabelText('E-mail')).toHaveValue('');
  expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
  expect(router.state.location.pathname).toBe('/login');
  await signIn(user);
  await screen.findByRole('heading', { name: 'Projeto novo' });
  expect(router.state.location.pathname).toBe('/dashboard');
  expect(screen.getByRole('navigation', { name: 'Navegação do dashboard' }).querySelector('[aria-current]')).toBeInTheDocument();
  await user.click(screen.getByText('Ver mensagem completa'));
  expect(screen.getByText(rows[0].message)).toBeVisible();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Marcar como visualizada' })).toHaveFocus();
  await user.click(screen.getByRole('button', { name: /Sair/ }));
  await screen.findByLabelText('Senha'); expect(loggedIn).toBe(false);
  expect(screen.queryByText('Projeto novo')).not.toBeInTheDocument();
});
it.each([['invalid', false], ['test-password', true]])('nega senha inválida ou usuário não autorizado: %s %s', async (password, unauthorized) => {
  const user = start('/login');
  await screen.findByLabelText('E-mail');
  if (unauthorized) { await user.clear(screen.getByLabelText('E-mail')); await user.type(screen.getByLabelText('E-mail'), 'visitor@example.com'); }
  await signIn(user, password);
  expect(await screen.findByText(/Não foi possível acessar a administração/)).toHaveAttribute('aria-live', 'polite');
  expect(screen.queryByText('Projeto novo')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Senha')).toHaveValue('');
});
it('retorna ao login e apaga dados quando a sessão expira', async () => {
  loggedIn = true; const user = start();
  await screen.findByText('Projeto novo'); expired = true;
  await user.click(screen.getByRole('button', { name: 'Atualizar', exact: true }));
  await screen.findByLabelText('Senha');
  expect(client.getQueriesData({ queryKey: ['admin'] })).toHaveLength(0);
});
it('restaura sessão válida ao abrir diretamente e rejeita sessão expirada', async () => {
  loggedIn = true; expired = true; start();
  await screen.findByLabelText('Senha'); expect(router.state.location.pathname).toBe('/login');
});
it('persiste respondida em nova consulta, filtra e permite desmarcar e arquivar', async () => {
  loggedIn = true; const user = start();
  await user.click(await screen.findByRole('button', { name: 'Marcar como respondida' }));
  await screen.findByText('Mensagem marcada como respondida.');
  expect(rows[0].status).toBe('responded');
  await user.click(screen.getByRole('button', { name: 'Atualizar', exact: true }));
  await screen.findByRole('button', { name: 'Desmarcar respondida' });
  await user.click(screen.getByRole('button', { name: 'Novas', exact: true }));
  await screen.findByText('Nenhuma mensagem neste filtro.');
  await user.click(screen.getByRole('button', { name: 'Respondidas', exact: true }));
  await user.click(await screen.findByRole('button', { name: 'Desmarcar respondida' }));
  await screen.findByText('Mensagem marcada como visualizada.');
  await user.click(screen.getByRole('button', { name: 'Todas', exact: true }));
  await user.click(await screen.findByRole('button', { name: 'Arquivar' }));
  await screen.findByText('Mensagem marcada como arquivada.');
  await user.click(screen.getByRole('button', { name: 'Arquivadas', exact: true }));
  await screen.findByText('Projeto novo'); expect(rows[0].status).toBe('archived');
});
it('preserva status se o servidor recusar atualização', async () => {
  loggedIn = true; failUpdate = true; const user = start();
  await user.click(await screen.findByRole('button', { name: 'Marcar como respondida' }));
  await screen.findByText(/Não foi possível acessar a administração/);
  expect(rows[0].status).toBe('new'); expect(screen.getByText('Nova', { exact: true })).toBeVisible();
});
it('limita quatro projetos, reordena, persiste e atualiza a home', async () => {
  loggedIn = true; const user = start();
  await user.click(await screen.findByLabelText('Selecionar projeto-1'));
  await user.click(screen.getByLabelText('Selecionar projeto-2')); await user.click(screen.getByLabelText('Selecionar projeto-3'));
  expect(screen.getByLabelText('Selecionar projeto-4')).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Mover projeto-3 para cima' }));
  await user.click(screen.getByRole('button', { name: /Salvar destaques/ }));
  await screen.findByText(/Destaques salvos com sucesso/);
  expect(selected).toEqual(['meu-caixa', 'projeto-1', 'projeto-3', 'projeto-2']);
  await user.click(screen.getByRole('link', { name: /Voltar ao portfólio/ }));
  await screen.findByRole('heading', { name: 'meu-caixa', level: 3 });
  const work = document.querySelector('#work');
  expect(within(work).queryByRole('heading', { name: 'projeto-4' })).not.toBeInTheDocument();
  expect([...work.querySelectorAll('h3')].map(node => node.textContent)).toEqual(selected);
});
it('ignora destaque removido e mantém um estado vazio seguro', async () => {
  selected = ['removido']; start('/');
  await screen.findByText('Nenhum projeto público foi encontrado.');
  expect(screen.queryByRole('heading', { name: 'meu-caixa' })).not.toBeInTheDocument();
});
it('mantém rascunho se salvamento falha e bloqueia navegação sem confirmação', async () => {
  loggedIn = true; failSave = true; vi.spyOn(window, 'confirm').mockReturnValue(false); const user = start();
  await user.click(await screen.findByLabelText('Selecionar projeto-1'));
  await user.click(screen.getByRole('button', { name: /Salvar destaques/ }));
  await screen.findByText(/Não foi possível acessar a administração/);
  expect(screen.getByText('Alterações não salvas')).toBeVisible();
  await user.click(screen.getByRole('link', { name: /Voltar ao portfólio/ }));
  await waitFor(() => expect(window.confirm).toHaveBeenCalled());
  expect(router.state.location.pathname).toBe('/dashboard');
});

it('exibe fork público selecionado e ignora repositório privado', async () => {
  selected = ['fork-publico', 'privado'];
  fetch.mockImplementation(async path => path.startsWith('https://api.github.com')
    ? jsonResponse([repository({ name: 'fork-publico', fork: true }), repository({ id: 2, name: 'privado', private: true })])
    : jsonResponse({ projects: selected.map((repository_name, position) => ({ repository_name, position })) }));
  start('/');
  await screen.findByRole('heading', { name: 'fork-publico', level: 3 });
  expect(screen.queryByRole('heading', { name: 'privado' })).not.toBeInTheDocument();
});
it('reconhece seleção salva com capitalização diferente', async () => {
  loggedIn = true; selected = ['MEU-CAIXA']; const user = start();
  expect(await screen.findByLabelText('Selecionar meu-caixa')).toBeChecked();
  await user.click(screen.getByLabelText('Selecionar meu-caixa'));
  expect(screen.getByText('0 de 4 projetos selecionados')).toBeVisible();
  expect(screen.getByRole('button', { name: /Salvar destaques/ })).toBeEnabled();
});
