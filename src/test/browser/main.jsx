// Ambiente exclusivo de testes em desenvolvimento. A entrada de produção do Vite nunca o importa.
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';
import { repository, jsonResponse } from '../fixtures.js';
import CaseGalleryHarness from './CaseGalleryHarness.jsx';
import '../../styles.css';

const realFetch = window.fetch.bind(window);
let scenario = 'loading';
let calls = [];
const pendingLoads = new Set();
let notifyCall = () => {};
const samples = [
  ['AETHER-front-end', 'JavaScript', '2026-10-24T12:00:00Z'],
  ['meu-caixa', 'TypeScript', '2026-10-23T12:00:00Z'],
  ['site-projeto-shopee', 'TypeScript', '2026-10-22T12:00:00Z'],
  ['anninha-site-novo', 'HTML', '2026-10-21T12:00:00Z'],
].map(([name, language, updated_at], index) => repository({
  id: index + 1, name, language, updated_at,
  description: `[Dados simulados para verificação local] Descrição de teste de ${name}.`,
  html_url: `https://github.com/portfolio-owner/${name}`,
  homepage: `https://example.invalid/${name}`,
  stargazers_count: 0, topics: ['dados-simulados', 'verificacao-local'],
}));

function successData(url) {
  if (url.includes('/users/')) return samples;
  const name = decodeURIComponent(new URL(url).pathname.split('/').at(-1));
  return samples.find((sample) => sample.name.toLowerCase() === name.toLowerCase())
    ?? repository({
      id: 99, name, description: `[Dados simulados] Repositório ${name} sem estudo de caso local.`,
      html_url: `https://github.com/portfolio-owner/${name}`, homepage: '',
      stargazers_count: 0, topics: ['dados-simulados'],
    });
}

function releaseLoading() {
  [...pendingLoads].forEach((complete) => complete());
}

window.fetch = (url, options) => {
  if (String(url).startsWith('/api/featured')) return Promise.resolve(
    scenario === 'featured-error' ? jsonResponse({}, 503) : jsonResponse({ projects: scenario === 'unselected' ? [] : samples.map((sample, position) => ({ repository_name: sample.name, position })) }),
  );
  // Este ambiente de testes da interface nunca deve gravar em serviços reais de contato ou administração.
  if (String(url).startsWith('/api/')) return Promise.resolve(jsonResponse({ error: 'Use o cenário dedicado de contato ou administração.' }, 401));
  if (!String(url).startsWith('https://api.github.com/')) return realFetch(url, options);
  const requestUrl = String(url);
  calls.push(requestUrl);
  notifyCall([...calls]);
  if (scenario === 'loading') return new Promise((resolve, reject) => {
    const finish = () => {
      pendingLoads.delete(finish);
      options?.signal?.removeEventListener('abort', abort);
      resolve(jsonResponse(successData(requestUrl)));
    };
    const abort = () => {
      pendingLoads.delete(finish);
      reject(new DOMException('Consulta simulada interrompida.', 'AbortError'));
    };
    pendingLoads.add(finish);
    options?.signal?.addEventListener('abort', abort, { once: true });
  });
  if (scenario === 'empty' && requestUrl.includes('/users/')) return Promise.resolve(jsonResponse([]));
  if (scenario === 'filtered' && requestUrl.includes('/users/')) return Promise.resolve(jsonResponse([
    { ...samples[0], fork: true }, { ...samples[1], archived: true },
  ]));
  if (scenario === 'error') return Promise.resolve(jsonResponse({}, 403));
  if (scenario === 'limit') return Promise.resolve(jsonResponse({}, 403, { 'x-ratelimit-remaining': '0' }));
  if (scenario === 'missing') return Promise.resolve(jsonResponse({}, 404));
  return Promise.resolve(jsonResponse(successData(requestUrl)));
};

function Harness() {
  const [session, setSession] = useState(() => ({ key: 0, client: new QueryClient(), path: '/' }));
  const [requestUrls, setRequestUrls] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('loading');
  const [destination, setDestination] = useState('/');
  const retiredSessions = useRef([]);
  notifyCall = setRequestUrls;

  useEffect(() => {
    // Os efeitos passivos de montagem executam após a limpeza das assinaturas da subárvore anterior.
    // Limpar um cliente enquanto seu App ainda o observa provoca uma nova busca artificial.
    for (const previous of retiredSessions.current.splice(0)) {
      previous.client.clear();
      previous.pendingLoads.forEach((complete) => complete());
    }
  }, [session.key]);

  const resetSession = (nextScenario, nextPath) => {
    retiredSessions.current.push({ client: session.client, pendingLoads: [...pendingLoads] });
    scenario = nextScenario;
    calls = [];
    setRequestUrls([]);
    setSession(({ key }) => ({ key: key + 1, client: new QueryClient(), path: nextPath }));
  };

  const selectScenario = (event) => {
    const value = event.target.value;
    setSelectedScenario(value);
    resetSession(value, destination);
  };

  const selectDestination = (event) => {
    const value = event.target.value;
    setDestination(value);
    resetSession(selectedScenario, value);
  };

  return (
    <>
      <aside style={{ position: 'sticky', top: 0, zIndex: 200, padding: 14, background: '#d6eb78', color: '#171b12', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }} aria-label="Controles de verificação local">
        <strong>Verificação local · API e metadados simulados</strong>
        <ThemeToggle />
        <label>Cenário <select value={selectedScenario} onChange={selectScenario}>
          <option value="loading">Carregamento</option><option value="success">Sucesso</option>
          <option value="empty">Lista vazia</option><option value="filtered">Somente forks e arquivados</option>
          <option value="unselected">Sem destaques selecionados</option><option value="featured-error">Falha na seleção de destaques</option>
          <option value="error">Indisponível</option><option value="limit">Limite de consultas</option><option value="missing">Repositório inexistente</option>
        </select></label>
        <label>Destino <select value={destination} onChange={selectDestination}>
          <option value="/">Página inicial /</option>
          {samples.map((sample) => <option key={sample.name} value={`/projetos/${sample.name}`}>{sample.name}</option>)}
          <option value="/projetos/CP6-Web-Dev">CP6-Web-Dev · sem conteúdo editorial</option>
          <option value="gallery">Galeria de teste</option>
        </select></label>
        <button type="button" onClick={() => { scenario = 'success'; setSelectedScenario('success'); releaseLoading(); }}>Liberar resposta / recuperar API</button>
        <button type="button" onClick={() => resetSession(selectedScenario, destination)}>Reiniciar sessão sem cache</button>
        <output aria-live="polite">Requisições: {requestUrls.length}</output>
        <a href="#work">Ver seção de projetos</a>
        <details style={{ flexBasis: '100%', minWidth: 0 }}><summary>Endpoints consultados ({requestUrls.length})</summary>
          <ol>{requestUrls.map((url, index) => <li key={`${index}-${url}`} style={{ overflowWrap: 'anywhere' }}><code>{url}</code></li>)}</ol>
        </details>
      </aside>
      <StrictMode><QueryClientProvider client={session.client} key={session.key}>
        {destination === 'gallery' ? <CaseGalleryHarness /> : <MemoryRouter initialEntries={[session.path]}><App /></MemoryRouter>}
      </QueryClientProvider></StrictMode>
    </>
  );
}

createRoot(document.getElementById('root')).render(<Harness />);
