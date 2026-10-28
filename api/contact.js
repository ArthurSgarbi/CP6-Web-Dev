import { processContact, failure } from '../server/contactBackend.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: failure }); }
  if (!req.headers['content-type']?.includes('application/json')) return res.status(415).json({ error: failure });
  if (Number(req.headers['content-length']) > 16000) return res.status(413).json({ error: failure });
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (JSON.stringify(body).length > 16000) return res.status(413).json({ error: failure });
  } catch { return res.status(400).json({ error: failure }); }
  const address = process.env.VERCEL ? String(req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
    : req.socket?.remoteAddress || 'local';
  const [status, result] = await processContact(body, address);
  if (status === 429) res.setHeader('Retry-After', '60');
  return res.status(status).json(result);
}
