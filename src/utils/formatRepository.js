import projectTechnologies from './projectTechnologies.js';

export const PROJECT_IMAGE_FALLBACK = '/images/hero-abstract.jpg';

const VISIBLE_REPOSITORIES = new Set([
  'aether-front-end',
  'meu-caixa',
  'site-projeto-shopee',
  'anninha-site-novo',
]);

// GitHub permits arbitrary homepage text. Only web URLs become clickable links.
function getLiveUrl(homepage) {
  if (!homepage?.trim()) return null;
  const value = homepage.trim();
  try {
    const url = new URL(/^[\w+.-]+:/.test(value) ? value : `https://${value}`);
    return ['https:', 'http:'].includes(url.protocol) && url.hostname && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function formatRepository(repository) {
  return {
    id: repository.id,
    slug: repository.name,
    title: repository.name,
    description: repository.description?.trim() || 'Descrição ainda não informada no GitHub',
    language: repository.language?.trim() || 'Tecnologia não informada',
    technologies: projectTechnologies[repository.name.toLowerCase()] ?? [repository.language?.trim() || 'Tecnologia não informada'],
    repositoryUrl: repository.html_url,
    liveUrl: getLiveUrl(repository.homepage),
    updatedAt: repository.updated_at,
    stars: repository.stargazers_count,
    topics: repository.topics,
    fork: repository.fork,
    archived: repository.archived,
    image: `/images/${encodeURIComponent(repository.name)}.png`,
    detailsUrl: `/projetos/${encodeURIComponent(repository.name)}`,
  };
}

export function formatRepositories(repositories) {
  return repositories
    .filter((repository) => VISIBLE_REPOSITORIES.has(repository.name.toLowerCase())
      && !repository.fork && !repository.archived)
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at) || a.name.localeCompare(b.name))
    .map(formatRepository);
}
