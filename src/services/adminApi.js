export const adminFailure = 'Não foi possível acessar o painel. Verifique seu acesso e tente novamente.';
export async function adminRequest(resource, options = {}) {
  let response;
  try {
    response = await fetch(`/api/admin?${resource}`, { credentials: 'same-origin', ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, signal: AbortSignal.timeout(15000) });
  } catch {
    throw new Error('Não foi possível conectar ao painel. Verifique sua conexão e tente novamente.');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(response.status >= 500
      ? 'O serviço do painel está indisponível no momento. Tente novamente em instantes.'
      : adminFailure);
    error.status = response.status;
    throw error;
  }
  return result;
}
export async function getFeaturedProjects() {
  try {
    const response = await fetch('/api/featured', { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error();
    const result = await response.json();
    if (!Array.isArray(result.projects)) throw new Error();
    return result.projects;
  } catch {
    const error = new Error('Não foi possível carregar a seleção de destaques do portfólio. Tente novamente em instantes.');
    error.code = 'FEATURED_UNAVAILABLE';
    throw error;
  }
}
export function selectFeatured(projects, selection) {
  return [...selection].sort((a, b) => a.position - b.position).map(item => projects.find(project => project.slug.toLowerCase() === item.repository_name.toLowerCase())).filter(Boolean);
}
