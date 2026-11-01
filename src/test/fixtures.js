// Dados de teste intencionalmente isolados. O código de produção nunca importa este módulo.
export function repository(overrides = {}) {
  return {
    id: 1,
    name: 'meu-caixa',
    description: 'Descrição real fornecida pela API de teste.',
    language: 'JavaScript',
    html_url: 'https://github.com/portfolio-owner/meu-caixa',
    homepage: 'https://alpha.example.com',
    updated_at: '2026-10-20T12:00:00Z',
    stargazers_count: 7,
    topics: ['react', 'portfolio'],
    fork: false,
    archived: false,
    ...overrides,
  };
}

export function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', ...headers },
  });
}
