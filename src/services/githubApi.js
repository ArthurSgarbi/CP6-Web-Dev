const API_URL = 'https://api.github.com';
const REQUEST_TIMEOUT = 15_000;

export class GitHubApiError extends Error {
  constructor(message, code, status = null) {
    super(message);
    this.name = 'GitHubApiError';
    this.code = code;
    this.status = status;
  }
}

function requireUsername(username) {
  if (typeof username !== 'string' || !username.trim()) {
    throw new GitHubApiError(
      import.meta.env.DEV
        ? 'Configure VITE_GITHUB_USERNAME no arquivo .env e reinicie o Vite.'
        : 'A integração de projetos ainda não foi configurada.',
      'CONFIGURATION',
    );
  }
  return encodeURIComponent(username.trim());
}

// Fail explicitly if GitHub changes its contract; never publish a partial list.
function validateRepository(repository) {
  const nullableText = (value) => value === null || typeof value === 'string';
  if (
    !repository || !Number.isInteger(repository.id) ||
    typeof repository.name !== 'string' || !repository.name.trim() ||
    !nullableText(repository.description) || !nullableText(repository.language) ||
    typeof repository.html_url !== 'string' || !repository.html_url.startsWith('https://github.com/') ||
    !nullableText(repository.homepage) ||
    typeof repository.updated_at !== 'string' || !Number.isFinite(Date.parse(repository.updated_at)) ||
    !Number.isInteger(repository.stargazers_count) || repository.stargazers_count < 0 ||
    !Array.isArray(repository.topics) || !repository.topics.every((topic) => typeof topic === 'string') ||
    typeof repository.fork !== 'boolean' || typeof repository.archived !== 'boolean'
  ) {
    throw new GitHubApiError('O GitHub enviou dados incompletos. Tente novamente mais tarde.', 'INVALID_RESPONSE');
  }
  return repository;
}

async function requestGitHub(url, notFoundMessage) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      credentials: 'omit',
      signal: controller.signal,
    });

    if (!response.ok) {
      // Error bodies may be HTML during an outage. Status and headers still work.
      const body = await response.json().catch(() => null);
      const rateLimited = response.status === 429 || (response.status === 403 && (
        response.headers.get('x-ratelimit-remaining') === '0' ||
        response.headers.has('retry-after') || /rate limit|abuse|secondary/i.test(body?.message ?? '')
      ));
      if (rateLimited) {
        throw new GitHubApiError('O limite temporário de consultas ao GitHub foi atingido. Aguarde alguns minutos antes de tentar novamente.', 'RATE_LIMIT', response.status);
      }
      if (response.status === 404) {
        throw new GitHubApiError(notFoundMessage, 'NOT_FOUND', 404);
      }
      if (response.status === 403) {
        throw new GitHubApiError('O GitHub não permitiu consultar os projetos no momento.', 'FORBIDDEN', 403);
      }
      throw new GitHubApiError('A integração com o GitHub está indisponível no momento.', 'UNAVAILABLE', response.status);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new GitHubApiError('O GitHub enviou uma resposta inválida. Tente novamente mais tarde.', 'INVALID_RESPONSE');
    }
    return { data, link: response.headers.get('link') };
  } catch (error) {
    if (error instanceof GitHubApiError) throw error;
    if (controller.signal.aborted) {
      throw new GitHubApiError('O GitHub demorou para responder. Tente novamente.', 'TIMEOUT');
    }
    throw new GitHubApiError('Não foi possível conectar ao GitHub. Verifique sua conexão e tente novamente.', 'NETWORK');
  } finally {
    clearTimeout(timeout);
  }
}

export async function getUserRepositories(username) {
  const user = requireUsername(username);
  const endpoint = `${API_URL}/users/${user}/repos?type=owner&sort=updated&direction=desc&per_page=100`;
  const repositories = [];
  let page = 1;
  let hasNextPage;

  do {
    const { data, link } = await requestGitHub(
      page === 1 ? endpoint : `${endpoint}&page=${page}`,
      'O perfil configurado não foi encontrado no GitHub.',
    );
    if (!Array.isArray(data)) {
      throw new GitHubApiError('O GitHub enviou uma lista inválida de projetos.', 'INVALID_RESPONSE');
    }
    repositories.push(...data.map(validateRepository));
    hasNextPage = Boolean(link && /<[^>]+>;\s*rel="next"/.test(link));
    page += 1;
  } while (hasNextPage);

  return [...new Map(repositories.map((repository) => [repository.id, repository])).values()];
}

export async function getRepositoryByName(username, repositoryName) {
  const user = requireUsername(username);
  if (typeof repositoryName !== 'string' || !repositoryName.trim()) {
    throw new GitHubApiError('Repositório não encontrado.', 'NOT_FOUND', 404);
  }
  const { data } = await requestGitHub(
    `${API_URL}/repos/${user}/${encodeURIComponent(repositoryName)}`,
    'Este repositório não existe ou não está disponível publicamente.',
  );
  return validateRepository(data);
}
