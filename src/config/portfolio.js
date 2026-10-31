// Public portfolio identity and editorial defaults; never put credentials here.
export const githubUsername = import.meta.env?.VITE_GITHUB_USERNAME?.trim() || 'ArthurSgarbi';

export const defaultFeaturedProjects = [
  'AETHER-front-end',
  'meu-caixa',
  'anninha-site-novo',
  'site-projeto-shopee',
].map((repository_name, position) => ({ repository_name, position }));
