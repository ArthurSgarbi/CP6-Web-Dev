import { StrictMode } from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.jsx';
import { githubKeys, githubUsername } from '../hooks/useGitHubProjects.js';
import { jsonResponse, repository } from './fixtures.js';

let clients = [];
beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
afterEach(() => { clients.forEach((client) => client.clear()); clients = []; });

function renderApp(path = '/', client = new QueryClient()) {
  clients.push(client);
  return {
    client,
    user: userEvent.setup(),
    ...render(
      <StrictMode><QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>
      </QueryClientProvider></StrictMode>,
    ),
  };
}

describe('projetos na página inicial', () => {
  it('exibe quatro skeletons e anuncia carregamento antes da resposta', async () => {
    let resolveRequest;
    fetch.mockImplementation(() => new Promise((resolve) => { resolveRequest = resolve; }));
    const { container } = renderApp();
    expect(screen.getByText('Carregando projetos do GitHub…')).toBeInTheDocument();
    expect(container.querySelector('.work-grid')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelectorAll('.project-skeleton')).toHaveLength(4);
    await act(async () => resolveRequest(jsonResponse([repository()])));
    expect(await screen.findByRole('heading', { name: 'meu-caixa' })).toBeInTheDocument();
  });

  it('mostra dados reais, filtra forks/arquivados e calcula o índice visual', async () => {
    fetch.mockResolvedValue(jsonResponse([
      repository(), repository({ id: 2, name: 'fork-oculto', fork: true }),
      repository({ id: 3, name: 'arquivo-oculto', archived: true }),
    ]));
    renderApp();
    expect(await screen.findByRole('heading', { name: 'meu-caixa' })).toBeInTheDocument();
    expect(screen.getByText('Descrição real fornecida pela API de teste.')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('01 /')).toBeInTheDocument();
    expect(screen.queryByText('fork-oculto')).not.toBeInTheDocument();
    expect(screen.queryByText('arquivo-oculto')).not.toBeInTheDocument();
    expect(screen.getByText('1 projeto carregado do GitHub.')).toHaveAttribute('role', 'status');
  });

  it.each([{ data: [] }, { data: [repository({ private: true }), repository({ id: 2, archived: true })] }])('trata lista vazia depois da filtragem: %j', async ({ data }) => {
    fetch.mockResolvedValue(jsonResponse(data));
    renderApp();
    expect(await screen.findByText('Nenhum projeto público foi encontrado.')).toBeInTheDocument();
    expect(screen.queryByText('Não foi possível carregar os projetos no momento.')).not.toBeInTheDocument();
  });

  it('mostra limite da API em região anunciável e permite tentar novamente', async () => {
    fetch.mockResolvedValueOnce(jsonResponse({}, 403, { 'x-ratelimit-remaining': '0' }))
      .mockResolvedValueOnce(jsonResponse([repository()]));
    const { user } = renderApp();
    const message = await screen.findByText(/O limite temporário de consultas/);
    expect(message.closest('[role="status"]')).toHaveAttribute('aria-live', 'polite');
    expect(fetch).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByRole('heading', { name: 'meu-caixa' })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('mostra indisponibilidade de forma amigável e faz apenas uma tentativa automática extra', async () => {
    fetch.mockImplementation(() => Promise.resolve(jsonResponse({ message: 'internal detail' }, 503)));
    renderApp();
    expect(await screen.findByText('Não foi possível carregar os projetos no momento.', {}, { timeout: 4000 })).toBeInTheDocument();
    expect(screen.getByText(/A integração com o GitHub está indisponível/)).toBeInTheDocument();
    expect(screen.queryByText('internal detail')).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('abre o projeto correto e mantém dados, navegação, foco e links do modal', async () => {
    fetch.mockResolvedValue(jsonResponse([
      repository(), repository({ id: 2, name: 'site-projeto-shopee', description: 'Descrição beta', homepage: '', language: 'Python' }),
    ]));
    const { user } = renderApp();
    const trigger = await screen.findByRole('button', { name: 'Abrir detalhes de site-projeto-shopee' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'site-projeto-shopee' })).toBeInTheDocument();
    expect(within(dialog).getByText('Descrição beta')).toBeInTheDocument();
    expect(within(dialog).getByText('TypeScript')).toBeInTheDocument();
    expect(within(dialog).getByText('Next.js')).toBeInTheDocument();
    expect(within(dialog).getByText('libSQL')).toBeInTheDocument();
    expect(within(dialog).getByText('7')).toBeInTheDocument();
    expect(within(dialog).getByText('react')).toBeInTheDocument();
    expect(within(dialog).queryByRole('link', { name: /Acessar projeto/ })).not.toBeInTheDocument();
    const codeLink = within(dialog).getByRole('link', { name: /Ver código no GitHub/ });
    expect(codeLink).toHaveAttribute('target', '_blank');
    expect(codeLink).toHaveAttribute('rel', 'noopener noreferrer');
    const close = within(dialog).getByRole('button', { name: 'Fechar detalhes do projeto' });
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(within(dialog).getByRole('button', { name: 'Próximo projeto' })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.click(within(dialog).getByRole('button', { name: 'Projeto anterior' }));
    expect(within(dialog).getByRole('heading', { name: 'meu-caixa' })).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Acessar projeto/ })).toHaveAttribute('href', 'https://alpha.example.com/');
    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(within(dialog).getByRole('heading', { name: 'site-projeto-shopee' })).toBeInTheDocument();
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('preserva os links externos na armadilha de foco', async () => {
    fetch.mockResolvedValue(jsonResponse([repository()]));
    const { user } = renderApp();
    await user.click(await screen.findByRole('button', { name: 'Abrir detalhes de meu-caixa' }));
    const dialog = screen.getByRole('dialog');
    await user.tab({ shift: true });
    expect(within(dialog).getByRole('link', { name: /Abrir página individual/ })).toHaveFocus();
    await user.tab();
    expect(within(dialog).getByRole('button', { name: 'Fechar detalhes do projeto' })).toHaveFocus();
  });

  it('fecha o modal se o projeto selecionado desaparecer do cache', async () => {
    fetch.mockResolvedValue(jsonResponse([repository()]));
    const { client, user } = renderApp();
    await user.click(await screen.findByRole('button', { name: 'Abrir detalhes de meu-caixa' }));
    act(() => client.setQueryData(githubKeys.repositories(githubUsername), []));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByText('Nenhum projeto público foi encontrado.')).toBeInTheDocument();
    expect(document.getElementById('work')).toHaveFocus();
    act(() => client.setQueryData(githubKeys.repositories(githubUsername), [repository()]));
    await screen.findByRole('heading', { name: 'meu-caixa' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('usa descrição/linguagem alternativas e fallback de imagem sem loop', async () => {
    fetch.mockResolvedValue(jsonResponse([repository({ description: null, language: null })]));
    renderApp();
    expect(await screen.findByText('Descrição ainda não informada no GitHub')).toBeInTheDocument();
    expect(screen.getByText('Tecnologia não informada')).toBeInTheDocument();
    expect(screen.queryByText('PostgreSQL')).not.toBeInTheDocument();
    const image = screen.getByRole('img', { name: 'Imagem de apresentação do repositório meu-caixa' });
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('width', '1200');
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/images/hero-abstract.jpg');
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/images/hero-abstract.jpg');
  });

  it('reutiliza a consulta entre StrictMode, seções, modal e página individual', async () => {
    fetch.mockImplementation(() => Promise.resolve(jsonResponse([repository()])));
    const { user } = renderApp();
    await screen.findByRole('heading', { name: 'meu-caixa' });
    await user.click(within(screen.getByRole('navigation', { name: 'Navegação principal' })).getByRole('link', { name: 'Diário' }));
    await user.click(screen.getByRole('button', { name: 'Abrir detalhes de meu-caixa' }));
    await user.click(screen.getByRole('link', { name: /Abrir página individual/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'meu-caixa' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /Voltar aos projetos/ }));
    await screen.findByRole('heading', { level: 3, name: 'meu-caixa' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('respeita movimento reduzido ao revelar cards e navegar por âncoras', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'), media: query,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }));
    fetch.mockResolvedValue(jsonResponse([repository()]));
    const { user } = renderApp();
    await screen.findByRole('heading', { name: 'meu-caixa' });
    expect(document.querySelector('#work article')).toHaveAttribute('data-reveal-state', 'visible');
    await user.click(screen.getByRole('link', { name: 'Explore os trabalhos selecionados' }));
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'instant', block: 'start' });
    expect(document.getElementById('work')).toHaveFocus();
  });
});

describe('rotas individuais', () => {
  it('abre sem cache consultando apenas o detalhe', async () => {
    fetch.mockImplementation((url) => Promise.resolve(jsonResponse(url.includes('/users/') ? [repository()] : repository())));
    renderApp('/projetos/meu-caixa');
    expect(await screen.findByRole('heading', { name: 'meu-caixa', level: 1 })).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch.mock.calls[0][0]).toMatch(/\/repos\/portfolio-owner\/meu-caixa$/);
    expect(fetch.mock.calls.some(([url]) => url.includes('/users/'))).toBe(false);
  });

  it('continua funcionando depois de remontar sem cache (equivalente a recarregar)', async () => {
    fetch.mockImplementation((url) => Promise.resolve(jsonResponse(url.includes('/users/') ? [repository()] : repository())));
    const view = renderApp('/projetos/meu-caixa');
    await screen.findByRole('heading', { name: 'meu-caixa', level: 1 });
    view.unmount();
    renderApp('/projetos/meu-caixa');
    await screen.findByRole('heading', { name: 'meu-caixa', level: 1 });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch.mock.calls.filter(([url]) => url.includes('/repos/portfolio-owner/meu-caixa'))).toHaveLength(2);
    expect(fetch.mock.calls.filter(([url]) => url.includes('/users/portfolio-owner/repos?'))).toHaveLength(0);
  });

  it('exibe 404 de repositório inexistente sem confundir com falha da API', async () => {
    fetch.mockResolvedValue(jsonResponse({}, 404));
    renderApp('/projetos/nao-existe');
    expect(await screen.findByRole('heading', { name: 'Repositório não encontrado' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('mostra falha da API com nova tentativa na rota direta', async () => {
    let detailAttempts = 0;
    fetch.mockImplementation((url) => {
      if (url.includes('/users/')) return Promise.resolve(jsonResponse([repository()]));
      detailAttempts += 1;
      return Promise.resolve(detailAttempts === 1 ? jsonResponse({}, 403) : jsonResponse(repository()));
    });
    const { user } = renderApp('/projetos/meu-caixa');
    await user.click(await screen.findByRole('button', { name: 'Tentar novamente' }));
    await screen.findByRole('heading', { name: 'meu-caixa', level: 1 });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(detailAttempts).toBe(2);
  });

  it('exibe 404 de URL desconhecida sem consultar a API', async () => {
    renderApp('/pagina-inexistente');
    expect(await screen.findByRole('heading', { name: 'Esta página não existe' })).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});

// Existing UI regressions isolate the public editorial configuration.
vi.mock('../services/adminApi.js', async importOriginal => ({
  ...await importOriginal(),
  getFeaturedProjects: async () => ['AETHER-front-end', 'meu-caixa', 'anninha-site-novo', 'site-projeto-shopee'].map((repository_name, position) => ({ repository_name, position })),
}));
