import { configured, database } from '../server/contactBackend.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' });
  if (!configured(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'])) return res.status(503).json({ error: 'Não foi possível carregar os destaques.' });
  try { return res.status(200).json({ projects: await database('featured_projects?select=repository_name,position&order=position.asc') }); }
  catch { return res.status(503).json({ error: 'Não foi possível carregar os destaques.' }); }
}
