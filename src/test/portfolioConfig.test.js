import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

it.each([undefined, '', '   '])('usa o perfil público sem variável de build: %s', async value => {
  vi.stubEnv('VITE_GITHUB_USERNAME', value);
  vi.resetModules();
  const { githubUsername } = await import('../config/portfolio.js');
  expect(githubUsername).toBe('ArthurSgarbi');
});

it('permite substituir o perfil por configuração de build', async () => {
  vi.stubEnv('VITE_GITHUB_USERNAME', ' outro-perfil ');
  vi.resetModules();
  const { githubUsername } = await import('../config/portfolio.js');
  expect(githubUsername).toBe('outro-perfil');
});
