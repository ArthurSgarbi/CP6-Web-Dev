import { StrictMode } from 'react';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.jsx';
import useGitHubProject from '../hooks/useGitHubProject.js';
import { githubKeys, githubUsername } from '../hooks/useGitHubProjects.js';
import useProjectNavigation from '../hooks/useProjectNavigation.js';
import { jsonResponse, repository } from './fixtures.js';
import { formatRepository } from '../utils/formatRepository.js';

const listKey = githubKeys.repositories(githubUsername);
const caseStudyHeadings = [
  'Sobre o projeto', 'O desafio',
];
const selectedRepositories = [
  repository({ id: 11, name: 'AETHER-front-end', updated_at: '2026-10-24T12:00:00Z' }),
  repository({ id: 12, name: 'meu-caixa', updated_at: '2026-10-23T12:00:00Z' }),
  repository({ id: 13, name: 'anninha-site-novo', updated_at: '2026-10-22T12:00:00Z' }),
  repository({ id: 14, name: 'site-projeto-shopee', updated_at: '2026-10-21T12:00:00Z' }),
];
let clients = [];

beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
afterEach(() => { clients.forEach((client) => client.clear()); clients = []; });

function createClient(repositories) {
  const client = new QueryClient();
  clients.push(client);
  client.setQueryData(['featured'], selectedRepositories.map((item, position) => ({ repository_name: item.name, position })));

  if (repositories) client.setQueryData(listKey, repositories);
  return client;
}

function queryWrapper(client) {
  return function Wrapper({ children }) {
    return <StrictMode><QueryClientProvider client={client}>{children}</QueryClientProvider></StrictMode>;
  };
}

function renderPage(name, client = createClient()) {
  return {
    client,
    user: userEvent.setup(),
    ...render(
      <StrictMode><QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[`/projetos/${encodeURIComponent(name)}`]}><App /></MemoryRouter>
      </QueryClientProvider></StrictMode>,
    ),
  };
}

function serveRepositories(detail, repositories = selectedRepositories) {
  fetch.mockImplementation((url) => Promise.resolve(jsonResponse(
    url.includes('/users/') ? repositories : detail,
  )));
}

describe('navegação entre estudos de caso', () => {
  it('usa atualização, filtros e ordem da mesma lista da home e deduplica em StrictMode', async () => {
    fetch.mockImplementation(() => Promise.resolve(jsonResponse([
      ...selectedRepositories.toReversed(),
      repository({ id: 15, name: 'ArthurSgarbi', updated_at: '2026-10-25T12:00:00Z' }),
      repository({ id: 16, name: 'fork-publico', fork: true, updated_at: '2026-10-26T12:00:00Z' }),
      repository({ id: 17, name: 'site-projeto-shopee', archived: true, updated_at: '2026-10-27T12:00:00Z' }),
    ])));
    const client = createClient();
    const { result, rerender } = renderHook(
      ({ name }) => useProjectNavigation(name),
      { initialProps: { name: 'MEU-CAIXA' }, wrapper: queryWrapper(client) },
    );
    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.next?.slug).toBe('anninha-site-novo'));
    expect(result.current.previous?.slug).toBe('AETHER-front-end');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain('/users/portfolio-owner/repos?');

    rerender({ name: 'anninha-site-novo' });
    expect(result.current.previous?.slug).toBe('meu-caixa');
    expect(result.current.next?.slug).toBe('site-projeto-shopee');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['AETHER-front-end', null, 'meu-caixa'],
    ['site-projeto-shopee', 'anninha-site-novo', null],
    ['outro-repositorio', null, null],
  ])('respeita os limites da lista para %s sem criar ordem editorial', (name, previous, next) => {
    const client = createClient(selectedRepositories);
    const { result } = renderHook(() => useProjectNavigation(name), { wrapper: queryWrapper(client) });
    expect(result.current.previous?.slug ?? null).toBe(previous);
    expect(result.current.next?.slug ?? null).toBe(next);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('reutiliza a listagem em cache também ao consultar o próximo detalhe', () => {
    const client = createClient(selectedRepositories);
    const { result } = renderHook(() => ({
      navigation: useProjectNavigation('meu-caixa'),
      detail: useGitHubProject('anninha-site-novo'),
    }), { wrapper: queryWrapper(client) });
    expect(result.current.navigation.next?.slug).toBe('anninha-site-novo');
    expect(result.current.detail.data?.title).toBe('Memórias a dois');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('não carrega a listagem enquanto o detalhe ainda não foi confirmado', async () => {
    fetch.mockImplementation(() => Promise.resolve(jsonResponse(selectedRepositories)));
    const client = createClient();
    const { result, rerender } = renderHook(
      ({ enabled }) => useProjectNavigation('meu-caixa', { enabled }),
      { initialProps: { enabled: false }, wrapper: queryWrapper(client) },
    );
    expect(result.current).toMatchObject({ previous: null, next: null, isPending: false });
    expect(fetch).not.toHaveBeenCalled();
    rerender({ enabled: true });
    await waitFor(() => expect(result.current.next?.slug).toBe('anninha-site-novo'));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('não usa vizinhos de cache antigo se a atualização da listagem falhar', async () => {
    fetch.mockImplementation(() => Promise.resolve(jsonResponse({}, 403)));
    const client = createClient(selectedRepositories);
    const { result } = renderHook(() => useProjectNavigation('meu-caixa'), { wrapper: queryWrapper(client) });
    expect(result.current.next?.slug).toBe('anninha-site-novo');
    await act(async () => client.invalidateQueries({ queryKey: listKey }));
    await waitFor(() => expect(result.current.error?.code).toBe('FORBIDDEN'));
    expect(result.current.previous).toBeNull();
    expect(result.current.next).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('páginas de estudo de caso', () => {
  it('usa a demonstração verificada do SYNC e preserva o identificador técnico', async () => {
    const raw = repository({ name: 'site-projeto-shopee', homepage: 'https://site-projeto-shopee.vercel.app/', stargazers_count: 0 });
    renderPage(raw.name, createClient([raw]));
    await screen.findByRole('heading', { level: 1, name: 'SYNC Mobile — Gestão de loja' });
    expect(screen.getByRole('link', { name: /Abrir demonstração/ })).toHaveAttribute('href', 'https://sync-mobile.vercel.app/demo');
    expect(screen.getByRole('link', { name: /Ver código no GitHub/ })).toHaveAttribute('href', raw.html_url);
    expect(formatRepository(raw).slug).toBe('site-projeto-shopee');
    expect(formatRepository(raw).repositoryName).toBe('site-projeto-shopee');
    expect(screen.queryByText('Estrelas no GitHub')).not.toBeInTheDocument();
    expect(screen.getByText(/Não há sincronização automática com a Shopee/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Demonstração pública do SYNC Mobile/ })).toHaveAttribute('src', '/images/projects/site-projeto-shopee/01-demo.webp');
  });

  it.each(selectedRepositories)('mantém $name em duas seções e oferece saída útil sem novas consultas', async (raw) => {
    const { container } = renderPage(raw.name, createClient(selectedRepositories));
    const title = await screen.findByRole('heading', { level: 1, name: formatRepository(raw).title });
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(title).toHaveFocus();
    caseStudyHeadings.forEach((name) => expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument());
    expect([...container.querySelectorAll('h2')].map((heading) => heading.textContent)).toEqual(caseStudyHeadings);
    expect(screen.getByRole('navigation', { name: 'Continuar a navegação' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Conversar sobre um projeto/ })).toHaveAttribute('href', '/#contato');
    expect(screen.getByText('Contribuição individual')).toBeInTheDocument();
    expect(screen.queryByText('Duração')).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/O README|este estudo reconstrói|cronologia de desenvolvimento/i);
    expect(document.title).toBe(`${formatRepository(raw).title} | Arthur Sgarbi`);
    expect(screen.getByRole('link', { name: /Voltar aos projetos/ })).toHaveAttribute('href', '/#work');
    expect(screen.getByRole('link', { name: /Todos os projetos/ })).toHaveAttribute('href', '/#work');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('combina apresentação editorial com metadados e URLs técnicos da API', async () => {
    const raw = repository({
      description: 'Descrição inédita fornecida pelo GitHub nesta consulta.',
      language: 'Linguagem da API', stargazers_count: 173, topics: ['topico-api'],
      html_url: 'https://github.com/portfolio-owner/meu-caixa', homepage: 'https://deploy-api.example.test/caminho',
    });
    serveRepositories(raw, [raw]);
    renderPage(raw.name);
    await screen.findByRole('heading', { level: 1, name: formatRepository(raw).title });
    expect(screen.getByText(formatRepository(raw).description)).toBeInTheDocument();
    expect(formatRepository(raw).repositoryDescription).toBe(raw.description);
    expect(screen.getByText(raw.language)).toBeInTheDocument();
    expect(screen.getByText('173')).toBeInTheDocument();
    expect(screen.getByText('topico-api')).toBeInTheDocument();
    expect(document.querySelector('time')).toHaveAttribute('dateTime', raw.updated_at);
    const code = screen.getByRole('link', { name: /Ver código no GitHub/ });
    const deployed = screen.getByRole('link', { name: /Acessar projeto/ });
    expect(code).toHaveAttribute('href', raw.html_url);
    expect(deployed).toHaveAttribute('href', raw.homepage);
    for (const link of [code, deployed]) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it('não cria link de deploy quando a API não fornece uma URL web segura', async () => {
    const raw = repository({ homepage: 'javascript:alert(1)' });
    renderPage(raw.name, createClient([raw]));
    await screen.findByRole('heading', { level: 1, name: formatRepository(raw).title });
    expect(screen.queryByRole('link', { name: /Acessar projeto/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver código no GitHub/ })).toBeInTheDocument();
  });

  it('exibe dados reais e mensagem neutra para repositório sem conteúdo editorial', async () => {
    const raw = repository({ id: 90, name: 'repositorio-sem-estudo' });
    serveRepositories(raw);
    renderPage(raw.name);
    await screen.findByRole('heading', { level: 1, name: formatRepository(raw).title });
    expect(screen.getByText(raw.description)).toBeInTheDocument();
    expect(screen.getByText(/estudo de caso.*(preparação|disponível|cadastrado)|conteúdo editorial.*(preparação|disponível|cadastrado)/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Repositório não encontrado' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver código no GitHub/ })).toHaveAttribute('href', raw.html_url);
  });

  it('preserva skeleton e status de carregamento sem iniciar navegação antecipada', async () => {
    let finishDetail;
    fetch.mockImplementation((url) => url.includes('/users/')
      ? Promise.resolve(jsonResponse(selectedRepositories))
      : new Promise((resolve) => { finishDetail = resolve; }));
    const { container } = renderPage('meu-caixa');
    expect(await screen.findByText('Carregando projeto…')).toHaveAttribute('role', 'status');
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(container.querySelector('.case-skeleton-cover')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    await act(async () => finishDetail(jsonResponse(repository())));
    await screen.findByRole('heading', { level: 1, name: 'Meu Caixa' });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it('distingue falha temporária de repositório ausente e permite nova tentativa', async () => {
    let attempt = 0;
    fetch.mockImplementation((url) => {
      if (url.includes('/users/')) return Promise.resolve(jsonResponse(selectedRepositories));
      attempt += 1;
      return Promise.resolve(attempt === 1 ? jsonResponse({}, 403) : jsonResponse(repository()));
    });
    const { user } = renderPage('meu-caixa');
    expect(await screen.findByText('Não foi possível carregar os projetos no momento.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Repositório não encontrado' })).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    await screen.findByRole('heading', { level: 1, name: 'Meu Caixa' });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });

  it('mostra 404 real sem requisitar a lista nem oferecer nova tentativa', async () => {
    fetch.mockImplementation(() => Promise.resolve(jsonResponse({}, 404)));
    renderPage('nao-existe');
    expect(await screen.findByRole('heading', { name: 'Repositório não encontrado' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voltar aos projetos/ })).toHaveAttribute('href', '/#work');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

});

// Existing UI regressions isolate the public editorial configuration.
vi.mock('../services/adminApi.js', async importOriginal => ({
  ...await importOriginal(),
  getFeaturedProjects: async () => ['AETHER-front-end', 'meu-caixa', 'anninha-site-novo', 'site-projeto-shopee'].map((repository_name, position) => ({ repository_name, position })),
}));
