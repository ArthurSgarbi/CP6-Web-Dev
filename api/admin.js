import { configured, database } from '../server/contactBackend.js';
const error = { error: 'Não foi possível acessar as mensagens. Verifique seu acesso e tente novamente.' };
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return res.status(405).json(error); }
  if (!configured(['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'CONTACT_ADMIN_USER_IDS'])) return res.status(503).json(error);
  const base = `${process.env.SUPABASE_URL}/auth/v1`;
  try {
    if (req.method === 'POST') {
      let body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || typeof body.email !== 'string' || typeof body.password !== 'string' || body.email.length > 254 || body.password.length > 1024) return res.status(400).json(error);
      const login = await fetch(`${base}/token?grant_type=password`, { method: 'POST', signal: AbortSignal.timeout(10000),
        headers: { apikey: process.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: body.email, password: body.password }) });
      if (!login.ok) return res.status(401).json(error);
      body = await login.json();
      if (!allowed(body.user?.id)) return res.status(403).json(error);
      return res.status(200).json({ token: body.access_token });
    }
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) return res.status(401).json(error);
    const userResponse = await fetch(`${base}/user`, { signal: AbortSignal.timeout(10000), headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: authorization } });
    if (!userResponse.ok) return res.status(401).json(error);
    if (!allowed((await userResponse.json()).id)) return res.status(403).json(error);
    const url = new URL(req.url, 'http://localhost');
    const offset = Math.max(0, Math.min(100000, Number.parseInt(url.searchParams.get('offset'), 10) || 0));
    const messages = await database(`contact_messages?select=id,name,email,subject,message,status,created_at,email_status,email_provider_id&order=created_at.desc,id.desc&limit=50&offset=${offset}`);
    return res.status(200).json({ messages });
  } catch { return res.status(503).json(error); }
}
function allowed(id) { return Boolean(id) && process.env.CONTACT_ADMIN_USER_IDS.split(',').map((value) => value.trim()).includes(id); }
