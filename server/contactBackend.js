import { createHmac, createHash } from 'node:crypto';
import { normalizeContact, validateContact } from '../shared/contactValidation.js';

export const failure = 'Não foi possível enviar sua mensagem agora. Revise os dados ou tente novamente em alguns instantes.';
export async function database(path, options = {}) {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...options, signal: AbortSignal.timeout(10000),
    headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) throw new Error('Database unavailable');
  return response.status === 204 ? null : response.json();
}
export function configured(names) { return names.every((name) => Boolean(process.env[name])); }
export async function processContact(body, clientAddress) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return [400, { error: failure }];
  const errors = validateContact(body);
  if (Object.keys(errors).length) return [422, { errors }];
  if (body.website || !/^[0-9a-f-]{36}$/i.test(body.requestId || '')) return [400, { error: failure }];
  if (!configured(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'])) return [503, { error: failure }];
  const data = normalizeContact(body);
  data.email = data.email.toLowerCase();
  const fingerprint = createHash('sha256').update(JSON.stringify(data)).digest('hex');
  const clientKey = createHmac('sha256', process.env.CONTACT_HASH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY).update(clientAddress).digest('hex');
  try {
    const reservation = await database('rpc/reserve_contact', { method: 'POST', body: JSON.stringify({
      p_request: body.requestId, p_client: clientKey, p_fingerprint: fingerprint, p_data: data,
    }) });
    if (reservation.result === 'sent') return [200, { ok: true }];
    if (['busy', 'conflict'].includes(reservation.result)) {
      const existing = await database(`contact_messages?request_id=eq.${body.requestId}&select=fingerprint&limit=1`);
      // A persisted message has already reached the administrator, even if email failed.
      if (existing[0]?.fingerprint === fingerprint) return [200, { ok: true }];
    }
    if (reservation.result !== 'claimed') return [reservation.result === 'conflict' ? 409 : 429, { error: failure }];
    // Email is an optional notification; the dashboard reads this persisted row.
    if (!configured(['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL'])) {
      // Use the existing diagnostic field: no schema migration or delivery queue is needed.
      await database(`contact_messages?id=eq.${reservation.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ email_error: 'not_configured' }) }).catch(() => {});
      return [200, { ok: true }];
    }
    let emailId;
    try {
      const email = await fetch('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(12000),
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json',
          'Idempotency-Key': `contact/${body.requestId}` },
        body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [process.env.CONTACT_TO_EMAIL],
          reply_to: data.email, subject: data.subject,
          text: `Nome: ${data.name}\nE-mail: ${data.email}\n\n${data.message}` }),
      });
      if (!email.ok) throw new Error('Email unavailable');
      emailId = (await email.json()).id;
      if (!emailId) throw new Error('Missing email receipt');
    } catch {
      await database(`contact_messages?id=eq.${reservation.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ email_status: 'failed', email_error: 'provider_unavailable' }) }).catch(() => {});
      return [200, { ok: true }];
    }
    await database(`contact_messages?id=eq.${reservation.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ email_status: 'sent', email_provider_id: emailId, email_error: null }) }).catch(() => {});
    return [200, { ok: true }];
  } catch { return [503, { error: failure }]; }
}
