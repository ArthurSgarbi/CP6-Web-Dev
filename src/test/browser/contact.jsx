// Somente Vite dev: nao faz parte da entrada de producao.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Contact from '../../components/Contact.jsx';
import '../../styles.css';
const realFetch = window.fetch.bind(window);
let scenario = 'success';
let count = 0;
let notify = () => {};
window.fetch = async (url, options) => {
  if (url !== '/api/contact') return realFetch(url, options);
  count++; notify(count);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (scenario === 'offline') throw new TypeError('Simulated offline');
  return new Response(JSON.stringify(scenario === 'success' ? { ok: true } : { error: 'Simulated failure' }), { status: scenario === 'success' ? 200 : 502, headers: { 'Content-Type': 'application/json' } });
};
function Harness() {
  const [mode, setMode] = useState('success');
  const [calls, setCalls] = useState(0);
  notify = setCalls;
  return <><aside className="page-width" style={{ paddingBlock: 20 }}>
    <p>Ambiente de teste — serviços simulados, nenhum e-mail real.</p>
    <label>Cenário <select value={mode} onChange={(event) => { scenario = event.target.value; setMode(scenario); }}>
      <option value="success">Sucesso</option><option value="server">Falha do servidor</option><option value="offline">Sem conexão</option>
    </select></label><p>Requisições: {calls}</p>
  </aside><Contact /></>;
}
createRoot(document.getElementById('root')).render(<Harness />);
