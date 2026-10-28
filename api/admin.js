import { configured, database } from '../server/contactBackend.js';
const failure = { error: 'Não foi possível acessar a administração. Verifique seu acesso e tente novamente.' };
const fields = 'id,name,email,subject,message,status,created_at,email_status';
const statuses = ['new', 'read', 'responded', 'archived'];
const allowed = id => Boolean(id) && process.env.CONTACT_ADMIN_USER_IDS.split(',').map(s => s.trim()).includes(id);
function cookie(res, value, age) {
  res.setHeader('Set-Cookie', `portfolio_admin=${encodeURIComponent(value)}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax; Path=/api/admin; Max-Age=${age}`);
}
async function auth(path, options = {}) {
  return fetch(`${process.env.SUPABASE_URL}/auth/v1/${path}`, { ...options, signal: AbortSignal.timeout(10000), headers: { apikey: process.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json', ...options.headers } });
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Cookie');
  if (!['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) return res.status(405).json(failure);
  try {
    if (req.method !== 'GET') {
      const origin = req.headers.origin;
      if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json(failure);
      if (req.method !== 'DELETE' && !req.headers['content-type']?.startsWith('application/json')) return res.status(415).json(failure);
    }
    if (!configured(['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'CONTACT_ADMIN_USER_IDS'])) return res.status(503).json(failure);
    const url = new URL(req.url, 'http://localhost');
    const resource = url.searchParams.get('resource') || 'messages';
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (req.method === 'POST' && resource === 'session') {
      if (!body || typeof body.email !== 'string' || typeof body.password !== 'string' || body.email.length > 254 || !body.password.length || body.password.length > 1024) return res.status(400).json(failure);
      const login = await auth('token?grant_type=password', { method: 'POST', body: JSON.stringify({ email: body.email, password: body.password }) });
      if (!login.ok) return res.status(401).json(failure);
      const session = await login.json();
      if (!allowed(session.user?.id)) return res.status(403).json(failure);
      cookie(res, session.access_token, Math.min(session.expires_in || 3600, 3600));
      return res.status(200).json({ user: { email: session.user.email } });
    }
    const raw = req.headers.cookie?.split(';').map(s => s.trim()).find(s => s.startsWith('portfolio_admin='))?.slice(16);
    const authorization = raw ? `Bearer ${decodeURIComponent(raw)}` : req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) { cookie(res, '', 0); return res.status(401).json(failure); }
    const userResponse = await auth('user', { headers: { Authorization: authorization } });
    if (!userResponse.ok) { cookie(res, '', 0); return res.status(401).json(failure); }
    const user = await userResponse.json();
    if (!allowed(user.id)) { cookie(res, '', 0); return res.status(403).json(failure); }
    if (resource === 'session') {
      if (req.method === 'DELETE') {
        const logout = await auth('logout', { method: 'POST', headers: { Authorization: authorization } });
        cookie(res, '', 0);
        if (!logout.ok) return res.status(503).json(failure);
      } else if (req.method !== 'GET') return res.status(405).json(failure);
      return res.status(200).json({ user: { email: user.email } });
    }
    if (resource === 'featured') {
      if (req.method === 'GET') return res.status(200).json({ projects: await database('featured_projects?select=repository_name,position&order=position.asc') });
      if (req.method !== 'PUT') return res.status(405).json(failure);
      const names = body?.repositories;
      if (!Array.isArray(names) || names.length > 4 || new Set(names.map(n => typeof n === 'string' ? n.toLowerCase() : n)).size !== names.length || names.some(n => typeof n !== 'string' || !/^[\w.-]{1,100}$/.test(n))) return res.status(400).json(failure);
      return res.status(200).json({ projects: await database('rpc/replace_featured_projects', { method: 'POST', body: JSON.stringify({ names }) }) });
    }
    if (resource !== 'messages') return res.status(404).json(failure);
    if (req.method === 'PATCH') {
      const id = url.searchParams.get('id');
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '') || !statuses.includes(body?.status)) return res.status(400).json(failure);
      const rows = await database(`contact_messages?id=eq.${id}&select=${fields}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ status: body.status }) });
      return rows.length ? res.status(200).json({ message: rows[0] }) : res.status(404).json(failure);
    }
    if (req.method !== 'GET') return res.status(405).json(failure);
    const filter = url.searchParams.get('status');
    if (filter && !statuses.includes(filter)) return res.status(400).json(failure);
    const offset = Math.max(0, Math.min(100000, Number.parseInt(url.searchParams.get('offset'), 10) || 0));
    const messages = await database(`contact_messages?select=${fields}&order=created_at.desc,id.desc&limit=50&offset=${offset}${filter ? `&status=eq.${filter}` : ''}`);
    const counts = await database('rpc/admin_message_counts', { method: 'POST', body: '{}' });
    return res.status(200).json({ messages, counts });
  } catch { return res.status(503).json(failure); }
}
