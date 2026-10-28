import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/contact.css';

async function adminRequest(options) {
  const response = await fetch('/api/admin', { ...options, signal: AbortSignal.timeout(15000) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error('Não foi possível acessar as mensagens. Verifique seu acesso e tente novamente.');
    error.status = response.status; throw error;
  }
  return result;
}
export default function DashboardPage() {
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const generation = useRef(0);
  useEffect(() => { document.title = 'Mensagens — Administração'; return () => { generation.current++; }; }, []);
  async function load(access, page = 0) {
    const result = await fetch(`/api/admin?offset=${page}`, { headers: { Authorization: `Bearer ${access}` }, signal: AbortSignal.timeout(15000) });
    if (!result.ok) { const failure = new Error('Sua sessão expirou ou o acesso está indisponível. Entre novamente.'); failure.status = result.status; throw failure; }
    return (await result.json()).messages;
  }
  async function login(event) {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const current = ++generation.current;
    setBusy(true); setError('');
    try {
      const result = await adminRequest({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(values)) });
      const rows = await load(result.token);
      if (generation.current !== current) return;
      setToken(result.token); setMessages(rows); setOffset(0); form.reset();
    } catch (failure) { if (generation.current === current) setError(failure.message); }
    finally { if (generation.current === current) setBusy(false); }
  }
  async function page(next) {
    const current = ++generation.current;
    setBusy(true); setError('');
    try {
      const rows = await load(token, next);
      if (generation.current === current) { setMessages(rows); setOffset(next); }
    } catch (failure) {
      if (generation.current === current) {
        setError(failure.message);
        if ([401, 403].includes(failure.status)) { setToken(null); setMessages([]); }
      }
    } finally { if (generation.current === current) setBusy(false); }
  }
  return <main className="contact-admin page-width section-space">
    <Link className="text-link" to="/">Voltar ao portfólio</Link>
    <h1>Mensagens de contato<span className="title-dot">.</span></h1>
    {!token ? <form onSubmit={login}>
      <p>Acesso restrito à administração.</p>
      <label htmlFor="admin-email">E-mail<input id="admin-email" name="email" type="email" autoComplete="username" required /></label>
      <label htmlFor="admin-password">Senha<input id="admin-password" name="password" type="password" autoComplete="current-password" required /></label>
      <button className="contact-submit" disabled={busy}>{busy ? 'Entrando...' : 'Entrar'}</button>
    </form> : <>
      <button className="contact-submit" onClick={() => { generation.current++; setToken(null); setMessages([]); setError(''); setBusy(false); }}>Sair</button>
      <button className="contact-submit" disabled={busy} onClick={() => page(offset)}>Atualizar</button>
      {busy && <p role="status">Carregando mensagens...</p>}
      {!busy && !messages.length && <p>Nenhuma mensagem nesta página.</p>}
      {messages.map((message) => <article key={message.id}>
        <h2 style={{ fontSize: 26 }}>{message.subject}</h2>
        <p>{message.name} · {message.email}</p>
        <time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString('pt-BR')}</time>
        <p>Status: {message.status} · E-mail: {({ sent: 'aceito pelo serviço', pending: 'pendente', failed: 'falhou' })[message.email_status] || message.email_status}</p>
        <p>{message.message.slice(0, 140)}{message.message.length > 140 ? '…' : ''}</p>
        <details><summary>Ver mensagem completa</summary><p>{message.message}</p></details>
      </article>)}
      <nav aria-label="Páginas de mensagens">
        <button className="contact-submit" disabled={busy || !offset} onClick={() => page(offset - 50)}>Anterior</button>
        <button className="contact-submit" disabled={busy || messages.length < 50} onClick={() => page(offset + 50)}>Próxima</button>
      </nav>
    </>}
    <p role="status" aria-live="polite" className="contact-feedback">{error}</p>
  </main>;
}
