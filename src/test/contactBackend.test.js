import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processContact } from '../../server/contactBackend.js';
import admin from '../../api/admin.js';
const valid = { requestId: '11111111-1111-4111-8111-111111111111', name: 'Teste', email: 'TESTE@example.com', subject: 'Projeto teste', message: 'Mensagem de teste com tamanho suficiente.' };
const json = (data, ok = true) => ({ ok, status: 200, json: async () => data });
beforeEach(() => {
  for (const name of ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY', 'RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL', 'CONTACT_HASH_SECRET', 'CONTACT_ADMIN_USER_IDS']) vi.stubEnv(name, name === 'CONTACT_ADMIN_USER_IDS' ? 'admin-user' : 'test-only');
});
describe('API de contato', () => {
  it('revalida sem acessar serviços', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    expect((await processContact({ ...valid, message: 'curta' }, 'test'))[0]).toBe(422);
    expect((await processContact({ ...valid, website: 'spam' }, 'test'))[0]).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('salva antes de enviar e confirma atualização antes de sucesso', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ result: 'claimed', id: 'id' })).mockResolvedValueOnce(json({ id: 'email-id' })).mockResolvedValueOnce({ ok: true, status: 204 }); vi.stubGlobal('fetch', fetch);
    expect(await processContact(valid, 'test')).toEqual([200, { ok: true }]);
    expect(fetch.mock.calls[0][0]).toContain('rpc/reserve_contact');
    expect(JSON.parse(fetch.mock.calls[0][1].body).p_data.email).toBe('teste@example.com');
    expect(fetch.mock.calls[1][0]).toBe('https://api.resend.com/emails');
    expect(fetch.mock.calls[1][1].headers['Idempotency-Key']).toBe(`contact/${valid.requestId}`);
    expect(JSON.parse(fetch.mock.calls[2][1].body).email_status).toBe('sent');
  });
  it('confirma recebimento no dashboard mesmo se e-mail falhar', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ result: 'claimed', id: 'id' })).mockResolvedValueOnce(json({}, false)).mockResolvedValueOnce({ ok: true, status: 204 }); vi.stubGlobal('fetch', fetch);
    expect((await processContact(valid, 'test'))[0]).toBe(200);
    expect(JSON.parse(fetch.mock.calls[2][1].body).email_status).toBe('failed');
  });
  it('falha sem persistência, mas confirma recebimento se só o registro do e-mail falhar', async () => {
    const fetch = vi.fn().mockRejectedValueOnce(new Error('db')); vi.stubGlobal('fetch', fetch);
    expect((await processContact(valid, 'test'))[0]).toBe(503); expect(fetch).toHaveBeenCalledTimes(1);
    fetch.mockResolvedValueOnce(json({ result: 'claimed', id: 'id' })).mockResolvedValueOnce(json({ id: 'mail' })).mockRejectedValueOnce(new Error('db'));
    expect((await processContact(valid, 'test'))[0]).toBe(200);
  });
  it.each([['sent', 200], ['limited', 429], ['busy', 429], ['conflict', 409]])('trata reserva %s sem duplicar envio', async (result, status) => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ result })).mockResolvedValueOnce(json([])); vi.stubGlobal('fetch', fetch);
    expect((await processContact(valid, 'test'))[0]).toBe(status);
  });
  it('salva no dashboard sem configuração de e-mail ou segredo de hash separado', async () => {
    for (const key of ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL', 'CONTACT_HASH_SECRET']) vi.stubEnv(key, '');
    const fetch = vi.fn().mockResolvedValue(json({ result: 'claimed', id: 'id' })); vi.stubGlobal('fetch', fetch);
    expect(await processContact(valid, 'test')).toEqual([200, { ok: true }]);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls.some(([url]) => url.includes('api.resend.com'))).toBe(false);
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ email_error: 'not_configured' });
  });
  it('reconhece retry de mensagem persistida sem duplicar nem depender do e-mail', async () => {
    const { createHash } = await import('node:crypto');
    const fingerprint = createHash('sha256').update(JSON.stringify({ name: valid.name, email: valid.email.toLowerCase(), subject: valid.subject, message: valid.message })).digest('hex');
    const fetch = vi.fn().mockResolvedValueOnce(json({ result: 'busy' })).mockResolvedValueOnce(json([{ fingerprint }])); vi.stubGlobal('fetch', fetch);
    expect(await processContact(valid, 'test')).toEqual([200, { ok: true }]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it('confirma a mensagem persistida mesmo se o registro de notificação desativada falhar', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const fetch = vi.fn().mockResolvedValueOnce(json({ result: 'claimed', id: 'id' })).mockRejectedValueOnce(new Error('db unavailable'));
    vi.stubGlobal('fetch', fetch);
    expect(await processContact(valid, 'test')).toEqual([200, { ok: true }]);
    expect(fetch.mock.calls.some(([url]) => url.includes('api.resend.com'))).toBe(false);
  });
});
function response() { return { setHeader: vi.fn(), status: vi.fn(function (status) { this.code = status; return this; }), json: vi.fn() }; }
describe('Autorização administrativa', () => {
  it.each([[undefined, null, 401], ['Bearer invalid', null, 401], ['Bearer visitor', 'visitor', 403]])('nega acesso %s', async (authorization, id, status) => {
    const fetch = vi.fn().mockResolvedValue(json({ id }, Boolean(id))); vi.stubGlobal('fetch', fetch);
    const res = response(); await admin({ method: 'GET', url: '/api/admin', headers: { authorization } }, res);
    expect(res.code).toBe(status); expect(fetch.mock.calls.some(([url]) => url.includes('/rest/v1/'))).toBe(false);
  });
  it('consulta somente depois de verificar usuário autorizado', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ id: 'admin-user' })).mockResolvedValueOnce(json([])).mockResolvedValueOnce(json({ new: 0, responded: 0 })); vi.stubGlobal('fetch', fetch);
    const res = response(); await admin({ method: 'GET', url: '/api/admin', headers: { authorization: 'Bearer valid' } }, res);
    expect(res.code).toBe(200); expect(fetch.mock.calls[0][0]).toContain('/auth/v1/user'); expect(fetch.mock.calls[1][0]).toContain('/rest/v1/contact_messages');
  });
});
