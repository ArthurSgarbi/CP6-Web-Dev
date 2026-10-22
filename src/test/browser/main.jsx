// Dedicated development harness. Vite's production entry never imports it.
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App.jsx';
import { repository, jsonResponse } from '../fixtures.js';
import '../../styles.css';

const realFetch = window.fetch.bind(window);
let scenario = 'loading';
let calls = 0;
let completeLoading;
let notifyCall = () => {};
const sample = repository();

window.fetch = (url, options) => {
  if (!String(url).startsWith('https://api.github.com/')) return realFetch(url, options);
  calls += 1;
  notifyCall(calls);
  if (scenario === 'loading') return new Promise((resolve) => {
    completeLoading = () => resolve(jsonResponse([sample]));
  });
  if (scenario === 'empty') return Promise.resolve(jsonResponse([]));
  if (scenario === 'filtered') return Promise.resolve(jsonResponse([repository({ fork: true }), repository({ id: 2, archived: true })]));
  if (scenario === 'error') return Promise.resolve(jsonResponse({}, 403));
  if (scenario === 'limit') return Promise.resolve(jsonResponse({}, 403, { 'x-ratelimit-remaining': '0' }));
  if (scenario === 'missing') return Promise.resolve(jsonResponse({}, 404));
  return Promise.resolve(jsonResponse(String(url).includes('/users/') ? [sample] : sample));
};

function Harness() {
  const [session, setSession] = useState(() => ({ key: 0, client: new QueryClient(), path: '/' }));
  const [callCount, setCallCount] = useState(0);
  notifyCall = setCallCount;

  const selectScenario = (event) => {
    scenario = event.target.value;
    calls = 0;
    setCallCount(0);
    completeLoading = undefined;
    session.client.clear();
    setSession(({ key }) => ({ key: key + 1, client: new QueryClient(), path: scenario === 'missing' ? '/projetos/nao-existe' : '/' }));
  };

  return (
    <>
      <aside style={{ position: 'sticky', top: 0, zIndex: 200, padding: 14, background: '#d6eb78', color: '#171b12', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }} aria-label="Controles de verificação local">
        <strong>Verificação local · API simulada</strong>
        <label>Cenário <select defaultValue="loading" onChange={selectScenario}>
          <option value="loading">Carregamento</option><option value="success">Sucesso</option>
          <option value="empty">Lista vazia</option><option value="filtered">Somente forks e arquivados</option>
          <option value="error">Indisponível</option><option value="limit">Limite de consultas</option><option value="missing">Repositório inexistente</option>
        </select></label>
        <button type="button" onClick={() => { scenario = 'success'; completeLoading?.(); }}>Liberar resposta / recuperar API</button>
        <output aria-live="polite">Requisições: {callCount}</output>
        <a href="#work">Ver seção de projetos</a>
      </aside>
      <StrictMode><QueryClientProvider client={session.client} key={session.key}>
        <MemoryRouter initialEntries={[session.path]}><App /></MemoryRouter>
      </QueryClientProvider></StrictMode>
    </>
  );
}

createRoot(document.getElementById('root')).render(<Harness />);
