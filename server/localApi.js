import contact from '../api/contact.js';
import admin from '../api/admin.js';
import featured from '../api/featured.js';

// Compartilhado pelo ambiente de desenvolvimento do Vite e pelo servidor de API independente opcional.
export async function handleApiRequest(req, res) {
  res.status = (status) => { res.statusCode = status; return res; };
  res.json = (body) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
  let body = '';
  try {
    for await (const chunk of req) {
      body += chunk;
      if (Buffer.byteLength(body) > 16000) { res.status(413).json({ error: 'Requisição muito grande.' }); return; }
    }
    req.body = body ? JSON.parse(body) : undefined;
    const path = req.url.split('?')[0];
    if (path === '/api/contact') await contact(req, res);
    else if (path === '/api/admin') await admin(req, res);
    else if (path === '/api/featured') await featured(req, res);
    else res.status(404).json({ error: 'Endpoint não encontrado.' });
  } catch { if (!res.writableEnded) res.status(400).json({ error: 'Requisição inválida.' }); }
}
