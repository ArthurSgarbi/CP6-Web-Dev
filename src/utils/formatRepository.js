import projectTechnologies from './projectTechnologies.js';

export const PROJECT_IMAGE_FALLBACK = '/images/hero-abstract.jpg';

// Editorial presentation is independent from repository identifiers and URLs.
export const projectPresentation = {
  'meu-caixa': {
    title: 'Meu Caixa',
    description: 'Aplicação para registrar receitas, despesas, contas, metas e cartões, distinguindo saldo confirmado de previsões.',
  },
  'site-projeto-shopee': {
    title: 'SYNC Mobile — Gestão de loja',
    description: 'Painel para registrar produtos, pedidos e entregas de uma loja que vende na Shopee. A operação é manual, sem sincronização com a plataforma.',
    // Verified on 29/10/2026: the legacy repository homepage returns 404.
    liveUrl: 'https://sync-mobile.vercel.app/demo',
    liveLabel: 'Abrir demonstração',
  },
  'aether-front-end': {
    title: 'AETHER — Portal institucional',
    description: 'Portal desenvolvido para a Global Solution da FIAP. Apresenta uma proposta de resiliência em desastres climáticos, com simulação de conectividade.',
  },
  'anninha-site-novo': {
    title: 'Memórias a dois',
    description: 'Página pessoal com narrativa, contador de tempo e galeria de memórias organizada por ano.',
  },
};

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
  const presentation = projectPresentation[repository.name.toLowerCase()];
  return {
    id: repository.id,
    slug: repository.name,
    repositoryName: repository.name,
    repositoryDescription: repository.description?.trim() || '',
    title: presentation?.title ?? repository.name,
    displayTitle: presentation?.title ?? repository.name,
    description: presentation?.description ?? (repository.description?.trim() || 'Descrição ainda não informada no GitHub.'),
    language: repository.language?.trim() || 'Tecnologia não informada',
    technologies: projectTechnologies[repository.name.toLowerCase()] ?? [repository.language?.trim() || 'Tecnologia não informada'],
    repositoryUrl: repository.html_url,
    liveUrl: presentation?.liveUrl ?? getLiveUrl(repository.homepage),
    liveLabel: presentation?.liveLabel ?? 'Acessar projeto',
    updatedAt: repository.updated_at,
    stars: repository.stargazers_count,
    topics: repository.topics,
    fork: repository.fork,
    archived: repository.archived,
    image: `/images/${encodeURIComponent(repository.name)}.png`,
    detailsUrl: `/projetos/${encodeURIComponent(repository.name)}`,
  };
}

export function formatRepositories(repositories, { includeForks = false } = {}) {
  return repositories
    .filter((repository) => !repository.private && (includeForks || !repository.fork) && !repository.archived)
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at) || a.name.localeCompare(b.name))
    .map(formatRepository);
}
