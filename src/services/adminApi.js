export const adminFailure = 'Não foi possível acessar a administração. Verifique seu acesso e tente novamente.';
export async function adminRequest(resource, options = {}) {
  const response = await fetch(`/api/admin?${resource}`, { credentials: 'same-origin', ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, signal: AbortSignal.timeout(15000) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(adminFailure); error.status = response.status; throw error; }
  return result;
}
export async function getFeaturedProjects() {
  const response = await fetch('/api/featured', { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Não foi possível carregar os destaques. Tente novamente.');
  const result = await response.json();
  if (!Array.isArray(result.projects)) throw new Error('A seleção de projetos está indisponível.');
  return result.projects;
}
export function selectFeatured(projects, selection) {
  return [...selection].sort((a, b) => a.position - b.position).map(item => projects.find(project => project.slug.toLowerCase() === item.repository_name.toLowerCase())).filter(Boolean);
}
