import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAdminAuth.jsx';
import './admin.css';
export default function LoginPage() {
  const auth = useAuth();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(location.state?.error || '');
  const [showPassword, setShowPassword] = useState(false);
  const password = useRef(null);
  const heading = useRef(null);
  useEffect(() => { document.title = 'Acesso ao painel — Arthur Sgarbi'; heading.current?.focus(); }, []);
  if (auth.user) return <Navigate to="/dashboard" replace />;
  async function login(event) {
    event.preventDefault();
    if (busy) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true); setError('');
    try { await auth.login(values); }
    catch (failure) { setError(failure.message); password.current.value = ''; password.current.focus(); }
    finally { setBusy(false); }
  }
  return <main className="admin-page admin-login page-width">
    <Link className="text-link" to="/">Voltar ao portfólio ↗</Link>
    <p className="admin-eyebrow">ÁREA DO PROPRIETÁRIO / ACESSO RESTRITO</p>
    <h1 ref={heading} tabIndex={-1}>Seu espaço<br />de gestão<span className="title-dot">.</span></h1>
    <p className="muted">Mensagens, projetos e o próximo passo do seu portfólio.</p>
    <form onSubmit={login} aria-busy={busy}>
      <label htmlFor="admin-email">E-mail<input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} /></label>
      <label htmlFor="admin-password">Senha<input ref={password} id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required maxLength={1024} aria-describedby="password-help" /></label>
      <button className="admin-button admin-password-toggle" type="button" aria-controls="admin-password" aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</button>
      <p className="muted admin-help" id="password-help">Acesso exclusivo do proprietário. Para recuperar o acesso, use o gerenciamento de usuários no projeto Supabase associado ao portfólio.</p>
      <button className="admin-button primary" disabled={busy || auth.loading}>{busy ? 'Entrando…' : 'Entrar'} <span aria-hidden="true">↗</span></button>
    </form>
    <p role="status" aria-live="polite" className={`admin-feedback${error ? ' admin-error' : ''}`}>{error || (auth.loading ? 'Verificando sessão…' : '')}</p>
  </main>;
}
