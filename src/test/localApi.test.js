import { Readable } from 'node:stream';
import { beforeEach, expect, it, vi } from 'vitest';
import { handleApiRequest } from '../../server/localApi.js';

beforeEach(() => {
  for (const key of ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) vi.stubEnv(key, 'test-only');
  vi.stubEnv('CONTACT_ADMIN_USER_IDS', 'owner');
  vi.stubGlobal('fetch', vi.fn());
});

async function request(url, { method = 'GET', body, origin = 'http://127.0.0.1:5173' } = {}) {
  const req = Readable.from(body === undefined ? [] : [body]);
  Object.assign(req, { url, method, headers: { host: '127.0.0.1:5173', origin, 'content-type': 'application/json' } });
  const res = { headers: {}, setHeader(name, value) { this.headers[name] = value; },
    end(body) { this.body = JSON.parse(body); this.writableEnded = true; } };
  await handleApiRequest(req, res);
  return res;
}

it('serve destaques pela mesma camada usada no Vite', async () => {
  fetch.mockResolvedValue(new Response(JSON.stringify([{ repository_name: 'meu-caixa', position: 0 }])));
  const res = await request('/api/featured');
  expect(res.statusCode).toBe(200);
  expect(res.body.projects[0].repository_name).toBe('meu-caixa');
});

it('encaminha JSON e query de login e entrega o cookie HttpOnly', async () => {
  fetch.mockResolvedValue(new Response(JSON.stringify({ user: { id: 'owner', email: 'owner@example.invalid' }, access_token: 'test-only', expires_in: 3600 })));
  const res = await request('/api/admin?resource=session', { method: 'POST', body: JSON.stringify({ email: 'owner@example.invalid', password: 'test-only' }) });
  expect(res.statusCode).toBe(200);
  expect(res.headers['Set-Cookie']).toContain('HttpOnly');
  expect(res.body).toEqual({ user: { email: 'owner@example.invalid' } });
});

it('preserva a verificação de origem na API integrada', async () => {
  const res = await request('/api/admin?resource=session', { method: 'POST', origin: 'https://other.invalid', body: '{}' });
  expect(res.statusCode).toBe(403);
  expect(fetch).not.toHaveBeenCalled();
});

it('responde JSON 404 para API desconhecida em vez de servir o SPA', async () => {
  expect((await request('/api/unknown')).statusCode).toBe(404);
});

it('rejeita JSON inválido e requisições grandes antes de chamar serviços', async () => {
  expect((await request('/api/admin', { method: 'POST', body: '{' })).statusCode).toBe(400);
  expect((await request('/api/admin', { method: 'POST', body: 'x'.repeat(16001) })).statusCode).toBe(413);
  expect(fetch).not.toHaveBeenCalled();
});
