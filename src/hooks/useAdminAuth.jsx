import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { adminRequest } from '../services/adminApi.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState({ loading: true, user: null, error: '' });
  const client = useQueryClient();
  const generation = useRef(0);
  const checkSession = useRef(() => Promise.resolve());
  function clear() { generation.current++; client.removeQueries({ queryKey: ['admin'] }); setSession({ loading: false, user: null, error: '' }); }
  useEffect(() => {
    let active = true;
    const check = () => {
      const current = generation.current;
      return adminRequest('resource=session').then(result => { if (active && current === generation.current) setSession({ loading: false, user: result.user, error: '' }); }).catch(error => {
        if (active && current === generation.current) { client.removeQueries({ queryKey: ['admin'] }); setSession({ loading: false, user: null, error: [401, 403].includes(error.status) ? '' : error.message }); }
      });
    };
    checkSession.current = check;
    check();
    const timer = setInterval(check, 60000);
    window.addEventListener('focus', check);
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', check); };
  }, [client]);
  async function request(resource, options) {
    try { return await adminRequest(resource, options); }
    catch (error) { if ([401, 403].includes(error.status)) clear(); throw error; }
  }
  return <AuthContext.Provider value={{ ...session, clear, request,
    retrySession: () => { setSession(current => ({ ...current, loading: true, error: '' })); return checkSession.current(); },
    login: async values => { generation.current++; const result = await adminRequest('resource=session', { method: 'POST', body: JSON.stringify(values) }); setSession({ loading: false, user: result.user, error: '' }); },
    logout: async () => { await request('resource=session', { method: 'DELETE' }); clear(); },
  }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
export function RequireAdmin({ children }) {
  const auth = useAuth();
  const location = useLocation();
  if (auth.loading) return <main className="page-width section-space" role="status">Verificando acesso…</main>;
  return auth.user ? children : <Navigate to="/login" replace state={{ from: location.pathname, error: auth.error }} />;
}
