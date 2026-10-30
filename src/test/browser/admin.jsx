// Harness exclusivo de desenvolvimento. Nenhuma credencial, cookie ou serviço real.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import App from '../../App.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';
import { repository, jsonResponse } from '../fixtures.js';
import '../../styles.css';
const scenario = new URLSearchParams(location.search).get('session');
let active = scenario === 'valid';
let selected = ['meu-caixa', 'site-projeto-shopee'];
let rows = [{ id: '11111111-1111-4111-8111-111111111111', name: 'Pessoa de teste', email: 'teste@example.invalid', subject: 'Conversa sobre um novo projeto', message: 'Esta é uma mensagem fictícia para validar leitura, status e filtros. Nenhum dado real está sendo utilizado.', status: 'new', email_status: 'pending', notification_status: 'not_configured', created_at: '2026-10-27T15:00:00Z' }];
const names = ['meu-caixa', 'site-projeto-shopee', 'anninha-site-novo', 'AETHER-front-end', 'portfolio-exemplo'];
window.fetch = async (path, options = {}) => {
  const projects = () => selected.map((repository_name, position) => ({ repository_name, position }));
  if (String(path).startsWith('https://api.github.com')) return jsonResponse(names.map((name, i) => repository({ id: i + 1, name })));
  if (path === '/api/featured') return jsonResponse({ projects: projects() });
  const url = new URL(path, location.origin);
  const resource = url.searchParams.get('resource');
  if (resource === 'session' && options.method === 'POST') {
    if (JSON.parse(options.body).password === 'invalid') return jsonResponse({}, 401);
    active = true; return jsonResponse({ user: { email: 'administrador@example.invalid' } });
  }
  if (!active || scenario === 'expired') return jsonResponse({}, 401);
  if (resource === 'session') { if (options.method === 'DELETE') active = false; return jsonResponse({ user: { email: 'administrador@example.invalid' } }); }
  if (resource === 'featured') { if (options.method === 'PUT') selected = JSON.parse(options.body).repositories; return jsonResponse({ projects: projects() }); }
  if (options.method === 'PATCH') { rows[0] = { ...rows[0], ...JSON.parse(options.body) }; return jsonResponse({ message: rows[0] }); }
  const status = url.searchParams.get('status');
  return jsonResponse({ messages: rows.filter(row => !status || (status === 'awaiting' ? ['new', 'read'].includes(row.status) : row.status === status)), counts: { new: rows.filter(row => row.status === 'new').length, responded: rows.filter(row => row.status === 'responded').length } });
};
const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const router = createMemoryRouter([{ path: '*', element: <App /> }], { initialEntries: ['/dashboard'] });
createRoot(document.getElementById('root')).render(<><aside style={{ padding: '12px 25px', background: '#24251f', color: '#f3f2ed', fontSize: 12, display: 'flex', alignItems: 'center', gap: 16 }}>TESTE LOCAL · DADOS E AUTENTICAÇÃO SIMULADOS · não comprova persistência real <ThemeToggle /></aside><QueryClientProvider client={client}><RouterProvider router={router} /></QueryClientProvider></>);
