import { beforeEach, expect, it, vi } from 'vitest';
import admin from '../../api/admin.js';
import featured from '../../api/featured.js';
const id = '11111111-1111-4111-8111-111111111111';
const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });
const res = () => ({ headers: {}, setHeader(name, value) { this.headers[name] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; } });
const req = (resource, method = 'GET', body) => ({ url: `/api/admin?resource=${resource}`, method, body, headers: { cookie: 'portfolio_admin=test-token', host: 'localhost', 'content-type': 'application/json' } });
beforeEach(() => {
  for (const name of ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) vi.stubEnv(name, 'test-only');
  vi.stubEnv('CONTACT_ADMIN_USER_IDS', id);
  for (const name of ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL']) vi.stubEnv(name, '');
  vi.stubGlobal('fetch', vi.fn());
});
it('login usa cookie HttpOnly seguro em produção sem retornar token', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  fetch.mockResolvedValue(json({ access_token: 'session-secret', expires_in: 3600, user: { id, email: 'arthursgarbi037@gmail.com' } }));
  const response = res(); await admin(req('session', 'POST', { email: 'arthursgarbi037@gmail.com', password: 'test-only' }), response);
  expect(response.code).toBe(200); expect(response.headers['Set-Cookie']).toContain('HttpOnly; Secure; SameSite=Lax');
  expect(response.body).not.toHaveProperty('token'); expect(response.headers['Cache-Control']).toBe('no-store');
});
it.each([[401, null, 401], [200, 'visitor', 403]])('nega credencial inválida ou UUID não autorizado', async (status, userId, expected) => {
  fetch.mockResolvedValue(json({ user: { id: userId } }, status));
  const response = res(); await admin(req('session', 'POST', { email: 'visitor@example.com', password: 'test' }), response);
  expect(response.code).toBe(expected); expect(response.body.error).toMatch(/Verifique seu acesso/);
});
it('sessão expirada apaga cookie e logout revoga sessão no Supabase', async () => {
  fetch.mockResolvedValueOnce(json({}, 401)); let response = res(); await admin(req('session'), response);
  expect(response.code).toBe(401); expect(response.headers['Set-Cookie']).toContain('Max-Age=0');
  fetch.mockResolvedValueOnce(json({ id })).mockResolvedValueOnce(json({})); response = res(); await admin(req('session', 'DELETE'), response);
  expect(response.code).toBe(200); expect(fetch.mock.calls.at(-1)[0]).toContain('/auth/v1/logout'); expect(response.headers['Set-Cookie']).toContain('Max-Age=0');
});
it('valida UUID, status, 404 e retorna apenas os campos públicos selecionados', async () => {
  fetch.mockResolvedValue(json({ id })); let response = res(); await admin(req('messages&id=invalid', 'PATCH', { status: 'responded' }), response); expect(response.code).toBe(400);
  response = res(); await admin(req(`messages&id=${id}`, 'PATCH', { status: 'invalid' }), response); expect(response.code).toBe(400);
  fetch.mockReset().mockResolvedValueOnce(json({ id })).mockResolvedValueOnce(json([])); response = res(); await admin(req(`messages&id=${id}`, 'PATCH', { status: 'responded' }), response); expect(response.code).toBe(404);
  fetch.mockReset().mockResolvedValueOnce(json({ id })).mockResolvedValueOnce(json([{ id, status: 'responded' }])); response = res(); await admin(req(`messages&id=${id}`, 'PATCH', { status: 'responded' }), response);
  expect(response.body.message.status).toBe('responded'); expect(response.body.message).not.toHaveProperty('email_error');
  expect(fetch.mock.calls[1][0]).not.toContain('email_provider_id');
  expect(fetch.mock.calls[1][1].headers.apikey).toBe('test-only');
});
it('recusa requisição de outra origem antes de consultar serviços', async () => {
  const request = req('featured', 'PUT', { repositories: [] }); request.headers.origin = 'https://attacker.invalid'; const response = res(); await admin(request, response);
  expect(response.code).toBe(403); expect(fetch).not.toHaveBeenCalled();
});
it('valida limite, duplicados e nomes antes de gravar destaques atomicamente', async () => {
  fetch.mockResolvedValue(json({ id }));
  for (const repositories of [['1', '2', '3', '4', '5'], ['one', 'ONE'], ['bad/name']]) { const response = res(); await admin(req('featured', 'PUT', { repositories }), response); expect(response.code).toBe(400); }
  fetch.mockReset().mockResolvedValueOnce(json({ id })).mockResolvedValueOnce(json([{ repository_name: 'second', position: 0 }, { repository_name: 'first', position: 1 }]));
  const response = res(); await admin(req('featured', 'PUT', { repositories: ['second', 'first'] }), response);
  expect(response.code).toBe(200); expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ names: ['second', 'first'] });
});
it('preserva paginação, filtro e contagem global', async () => {
  fetch.mockResolvedValueOnce(json({ id })).mockResolvedValueOnce(json([])).mockResolvedValueOnce(json({ new: 60, responded: 20 }));
  const response = res(); await admin(req('messages&offset=50&status=responded'), response);
  expect(response.code).toBe(200); expect(fetch.mock.calls[1][0]).toContain('limit=50&offset=50&status=eq.responded'); expect(response.body.counts.new).toBe(60);
});
it('filtra novas e visualizadas como aguardando resposta sem incluir arquivadas', async () => {
  fetch.mockResolvedValueOnce(json({ id })).mockResolvedValueOnce(json([])).mockResolvedValueOnce(json({ new: 1, responded: 2 }));
  const response = res(); await admin(req('messages&status=awaiting'), response);
  expect(response.code).toBe(200);
  expect(fetch.mock.calls[1][0]).toContain('&status=in.(new,read)');
  expect(response.body.counts.responded).toBe(2);
});
it.each([
  ['pending', 'not_configured', true, 'not_configured'],
  ['pending', null, false, 'not_configured'],
  ['pending', null, true, 'unconfirmed'],
  ['sent', null, false, 'sent'],
  ['failed', 'provider-detail-not-for-client', true, 'failed'],
])('expõe estado seguro de notificação: %s / %s', async (email_status, email_error, emailConfigured, expected) => {
  if (emailConfigured) for (const key of ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL']) vi.stubEnv(key, 'test-only');
  fetch.mockResolvedValueOnce(json({ id }))
    .mockResolvedValueOnce(json([{ id, email_status, email_error }]))
    .mockResolvedValueOnce(json({}));
  const response = res(); await admin(req('messages'), response);
  expect(response.body.messages[0].notification_status).toBe(expected);
  expect(response.body.messages[0]).not.toHaveProperty('email_error');
  expect(JSON.stringify(response.body)).not.toContain('provider-detail');
});
it('endpoint público é somente leitura e consulta apenas nome e posição', async () => {
  fetch.mockResolvedValue(json([{ repository_name: 'one', position: 0 }])); const response = res(); await featured({ method: 'GET' }, response);
  expect(response.body.projects).toEqual([{ repository_name: 'one', position: 0 }]); expect(fetch.mock.calls[0][0]).toContain('select=repository_name,position');
  const rejected = res(); await featured({ method: 'PUT' }, rejected); expect(rejected.code).toBe(405);
});

it('mantém os destaques públicos sem configuração do Supabase', async () => {
  vi.stubEnv('SUPABASE_URL', '');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
  const response = res();
  await featured({ method: 'GET' }, response);
  expect(response.code).toBe(200);
  expect(response.body.projects.map(item => item.repository_name)).toEqual([
    'AETHER-front-end', 'meu-caixa', 'anninha-site-novo', 'site-projeto-shopee',
  ]);
  expect(fetch).not.toHaveBeenCalled();
});

it('preserva seleção vazia e informa falha quando o banco está configurado', async () => {
  fetch.mockResolvedValueOnce(json([])).mockRejectedValueOnce(new Error('offline'));
  const empty = res();
  await featured({ method: 'GET' }, empty);
  expect(empty.code).toBe(200);
  expect(empty.body.projects).toEqual([]);
  const failure = res();
  await featured({ method: 'GET' }, failure);
  expect(failure.code).toBe(503);
});
