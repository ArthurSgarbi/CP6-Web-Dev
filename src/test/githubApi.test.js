import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRepositoryByName, getUserRepositories } from '../services/githubApi.js';
import { formatRepositories, formatRepository } from '../utils/formatRepository.js';
import formatDate from '../utils/formatDate.js';
import { jsonResponse, repository } from './fixtures.js';

beforeEach(() => vi.stubGlobal('fetch', vi.fn()));

describe('service GitHub REST', () => {
  it('usa o endpoint e Accept corretos, sem autenticação', async () => {
    fetch.mockResolvedValue(jsonResponse([repository()]));
    expect(await getUserRepositories('ArthurSgarbi')).toHaveLength(1);
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      'https://api.github.com/users/ArthurSgarbi/repos?type=owner&sort=updated&direction=desc&per_page=100',
      expect.objectContaining({ headers: { Accept: 'application/vnd.github+json' }, credentials: 'omit' }),
    );
  });

  it('busca detalhes codificando o nome do repositório', async () => {
    fetch.mockResolvedValue(jsonResponse(repository()));
    await getRepositoryByName('owner', 'projeto teste');
    expect(fetch.mock.calls[0][0]).toBe('https://api.github.com/repos/owner/projeto%20teste');
  });

  it('pagina automaticamente e não devolve apenas os primeiros 100', async () => {
    fetch.mockResolvedValueOnce(jsonResponse([repository()], 200, {
      link: '<https://api.github.com/users/owner/repos?page=2>; rel="next"',
    })).mockResolvedValueOnce(jsonResponse([repository({ id: 2, name: 'pagina-2' })]));
    expect(await getUserRepositories('owner')).toHaveLength(2);
    expect(fetch.mock.calls[1][0]).toMatch(/per_page=100&page=2$/);
  });

  it('falha explicitamente se outra página falhar', async () => {
    fetch.mockResolvedValueOnce(jsonResponse([repository()], 200, {
      link: '<https://api.github.com/users/owner/repos?page=2>; rel="next"',
    })).mockResolvedValueOnce(jsonResponse({}, 500));
    await expect(getUserRepositories('owner')).rejects.toMatchObject({ code: 'UNAVAILABLE' });
  });

  it.each([
    [403, { 'x-ratelimit-remaining': '0' }, 'RATE_LIMIT'],
    [403, { 'retry-after': '60' }, 'RATE_LIMIT'],
    [403, {}, 'FORBIDDEN'],
    [404, {}, 'NOT_FOUND'],
    [429, {}, 'RATE_LIMIT'],
    [503, {}, 'UNAVAILABLE'],
  ])('diferencia HTTP %s com headers %j', async (status, headers, code) => {
    fetch.mockResolvedValue(jsonResponse({}, status, headers));
    await expect(getRepositoryByName('owner', 'repo')).rejects.toMatchObject({ code, status });
  });

  it('reconhece limite secundário pelo corpo da resposta', async () => {
    fetch.mockResolvedValue(jsonResponse({ message: 'Secondary rate limit exceeded' }, 403));
    await expect(getUserRepositories('owner')).rejects.toMatchObject({ code: 'RATE_LIMIT' });
  });

  it('transforma falha de rede em erro compreensível', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(getUserRepositories('owner')).rejects.toMatchObject({ code: 'NETWORK' });
  });

  it('rejeita configuração ausente sem enviar requisição', async () => {
    await expect(getUserRepositories('')).rejects.toMatchObject({ code: 'CONFIGURATION' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejeita lista e repositórios incompletos', async () => {
    fetch.mockResolvedValueOnce(jsonResponse({})).mockResolvedValueOnce(jsonResponse([{ id: 1 }]));
    await expect(getUserRepositories('owner')).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
    await expect(getUserRepositories('owner')).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });

  it('rejeita JSON inválido', async () => {
    fetch.mockResolvedValue(new Response('invalid json', { status: 200 }));
    await expect(getUserRepositories('owner')).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
});

describe('transformação e formatação', () => {
  it('remove forks e arquivados mesmo entre os repositórios selecionados', () => {
    expect(formatRepositories([
      repository(), repository({ id: 2, name: 'site-projeto-shopee', fork: true }),
      repository({ id: 3, name: 'anninha-site-novo', archived: true }),
    ]).map((project) => project.id)).toEqual([1]);
  });

  it('exibe somente os três projetos selecionados e exclui ArthurSgarbi', () => {
    const names = ['meu-caixa', 'site-projeto-shopee', 'anninha-site-novo'];
    const projects = formatRepositories([
      ...names.map((name, index) => repository({ id: index + 1, name })),
      repository({ id: 5, name: 'CP6-Web-Dev' }),
      repository({ id: 6, name: 'meu-caixa-demo' }),
      repository({ id: 7, name: 'ArthurSgarbi' }),
    ]);
    expect(projects).toHaveLength(3);
    expect(projects.map((project) => project.title)).toEqual(expect.arrayContaining(names));
  });

  it('retorna lista vazia quando nenhum repositório está selecionado', () => {
    expect(formatRepositories([repository({ name: 'outro-projeto' })])).toEqual([]);
  });

  it('ordena pela atualização e usa fallback apenas para dados ausentes', () => {
    const projects = formatRepositories([
      repository({ description: null, language: null, homepage: '' }),
      repository({ id: 2, name: 'anninha-site-novo', updated_at: '2026-10-21T12:00:00Z' }),
    ]);
    expect(projects[0].id).toBe(2);
    expect(projects[1]).toMatchObject({
      description: 'Descrição ainda não informada no GitHub', language: 'Tecnologia não informada',
      liveUrl: null, image: '/images/meu-caixa.png', detailsUrl: '/projetos/meu-caixa', stars: 7,
    });
  });

  it.each(['javascript:alert(1)', 'data:text/html,test', 'https://user:password@example.com'])('não torna homepage insegura clicável: %s', (homepage) => {
    expect(formatRepository(repository({ homepage })).liveUrl).toBeNull();
  });

  it('aceita site sem protocolo e formata data sem desvio de fuso', () => {
    expect(formatRepository(repository({ homepage: 'example.com' })).liveUrl).toBe('https://example.com/');
    expect(formatDate('2026-10-20T00:00:00Z')).toContain('20');
    expect(formatDate(null)).toBe('Data não informada');
  });
});
