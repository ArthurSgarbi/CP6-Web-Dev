import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, UNSAFE_DataRouterContext } from 'react-router-dom';
import UnsavedChanges from '../components/UnsavedChanges.jsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAdminAuth.jsx';
import useGitHubProjects from '../hooks/useGitHubProjects.js';
import ProjectImage from '../components/ProjectImage.jsx';
import { projectCaseStudies } from '../data/projectCaseStudies.js';
import './admin.css';
const labels = { new: 'Nova', read: 'Visualizada', responded: 'Respondida', archived: 'Arquivada' };
const delivery = { sent: 'Aceita pelo serviço de e-mail; entrega não confirmada', not_configured: 'Não utilizada — serviço não configurado', pending: 'Sem confirmação de envio', unconfirmed: 'Sem confirmação de envio', failed: 'Falha na notificação' };
export default function DashboardPage() {
  const auth = useAuth();
  const dataRouter = useContext(UNSAFE_DataRouterContext);
  const client = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [offset, setOffset] = useState(0);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [draft, setDraft] = useState(null);
  const [activeSection, setActiveSection] = useState('messages');
  const heading = useRef(null);
  const featuredHeading = useRef(null);
  const actionFocus = useRef(null);
  useEffect(() => {
    if (!pending && actionFocus.current) {
      (actionFocus.current.isConnected ? actionFocus.current : heading.current)?.focus();
      actionFocus.current = null;
    }
  }, [pending]);
  const messages = useQuery({ queryKey: ['admin', 'messages', filter, offset], queryFn: () => auth.request(`resource=messages&offset=${offset}&status=${filter}`), retry: false });
  const featured = useQuery({ queryKey: ['admin', 'featured'], queryFn: () => auth.request('resource=featured'), retry: false });
  const repositories = useGitHubProjects({ all: true });
  const availableProjects = repositories.data?.filter(project => Object.hasOwn(projectCaseStudies, project.slug.toLowerCase()));
  const saved = (featured.data?.projects || []).map(project => project.repository_name);
  const selection = draft ?? saved;
  const selectedItems = useRef(new Map());
  const reorderedName = useRef(null);
  useEffect(() => {
    if (reorderedName.current) {
      selectedItems.current.get(reorderedName.current)?.focus();
      reorderedName.current = null;
    }
  }, [selection]);
  const isSelected = name => selection.some(item => item.toLowerCase() === name.toLowerCase());
  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => { document.title = 'Painel do portfólio — Arthur Sgarbi'; heading.current?.focus(); }, []);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);
  const mayLeave = () => !dirty || window.confirm('Há alterações não salvas. Deseja sair e descartá-las?');
  async function update(message, status, trigger) {
    if (pending) return;
    actionFocus.current = trigger;
    setPending(true); setFeedback('Atualizando mensagem…');
    try {
      await auth.request(`resource=messages&id=${message.id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await client.invalidateQueries({ queryKey: ['admin', 'messages'] });
      setFeedback(`Mensagem marcada como ${labels[status].toLowerCase()}.`);
    } catch (error) { setFeedback(error.message); }
    finally { setPending(false); }
  }
  function toggle(name) {
    if (pending) return;
    if (isSelected(name)) setDraft(selection.filter(item => item.toLowerCase() !== name.toLowerCase()));
    else if (selection.length < 4) setDraft([...selection, name]);
    setFeedback('Seleção alterada. Salve os destaques para publicar.');
  }
  function move(index, delta) {
    reorderedName.current = selection[index];
    const next = [...selection];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setDraft(next); setFeedback('Ordem alterada. Salve os destaques para publicar.');
  }
  async function save() {
    if (pending || !dirty) return;
    actionFocus.current = featuredHeading.current;
    setPending(true); setFeedback('Salvando destaques…');
    try {
      const result = await auth.request('resource=featured', { method: 'PUT', body: JSON.stringify({ repositories: selection }) });
      client.setQueryData(['admin', 'featured'], result);
      client.setQueryData(['featured'], result.projects);
      await client.invalidateQueries({ queryKey: ['featured'] });
      setDraft(null); setFeedback('Destaques salvos com sucesso. A seção Projetos da página inicial foi atualizada.');
    } catch (error) { setFeedback(error.message); }
    finally { setPending(false); }
  }
  async function logout() {
    if (!mayLeave() || pending) return;
    setPending(true);
    try { await auth.logout(); navigate('/login', { replace: true }); }
    catch (error) { setFeedback(error.message); }
    finally { setPending(false); }
  }
  const counts = messages.data?.counts;
  return <main className="admin-page page-width">
    {dataRouter && <UnsavedChanges dirty={dirty} />}
    <header className="admin-header">
      <Link to="/" className="text-link">Voltar ao portfólio ↗</Link>
      <div className="admin-identity"><span>{auth.user.email}</span><button className="admin-button" disabled={pending} onClick={logout}>Sair ↗</button></div>
    </header>
    <p className="admin-eyebrow">PORTFÓLIO / ÁREA DO PROPRIETÁRIO</p>
    <h1 ref={heading} tabIndex={-1}>Painel do portfólio<span className="title-dot">.</span></h1>
    <p className="muted">Conversas que chegam. Projetos que merecem destaque.</p>
    <div className="admin-stats" aria-label="Resumo do painel">
      <div><strong>{counts?.new ?? '—'}</strong><span>Novas mensagens</span></div>
      <div><strong>{counts?.responded ?? '—'}</strong><span>Respondidas</span></div>
      <div><strong>{featured.data ? saved.length : '—'}<small> / 4</small></strong><span>Projetos publicados</span></div>
    </div>
    <nav className="admin-nav" aria-label="Navegação do painel">
      <a href="#messages" aria-current={activeSection === 'messages' ? 'location' : undefined} onClick={() => setActiveSection('messages')}>01 / Mensagens</a>
      <a href="#featured" aria-current={activeSection === 'featured' ? 'location' : undefined} onClick={() => setActiveSection('featured')}>02 / Projetos em destaque</a>
    </nav>
    <p className="admin-feedback" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
    <section id="messages" className="admin-section" aria-labelledby="messages-title" aria-busy={messages.isFetching || pending}>
      <div className="admin-section-heading"><h2 id="messages-title">Mensagens recebidas</h2><button className="admin-button" disabled={messages.isFetching || pending} onClick={() => messages.refetch()}>Atualizar</button></div>
      <div className="admin-filters" role="group" aria-label="Filtrar mensagens">
        {[['', 'Todas'], ['awaiting', 'Aguardando resposta'], ['new', 'Novas'], ['read', 'Visualizadas'], ['responded', 'Respondidas'], ['archived', 'Arquivadas']].map(([value, label]) => <button key={value} className="admin-button" aria-pressed={filter === value} disabled={pending} onClick={() => { setOffset(0); setFilter(value); }}>{label}</button>)}
      </div>
      <p className="muted admin-help">As mensagens desta caixa foram recebidas pelo portfólio. A notificação por e-mail é opcional e não há fila de reenvio automático. Marcar como respondida apenas organiza a caixa; use “Responder por e-mail” para abrir seu aplicativo de e-mail.</p>
      {messages.isFetching && <p role="status">Carregando mensagens…</p>}
      {messages.error && <p role="alert">{messages.error.message} <button className="admin-button" onClick={() => messages.refetch()}>Tentar novamente</button></p>}
      {!messages.isFetching && !messages.error && !messages.data?.messages.length && <p className="admin-empty">Nenhuma mensagem neste filtro.</p>}
      {messages.data?.messages.map(message => <article key={message.id} className={`admin-message ${message.status === 'new' ? 'is-new' : ''}`}>
        <div className="admin-message-meta"><span className="admin-badge">{labels[message.status]}</span><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString('pt-BR')}</time></div>
        <h3>{message.subject}</h3><p>{message.name} · {message.email}</p>
        <p className="muted">Notificação por e-mail: {delivery[message.notification_status || message.email_status] || 'Sem informação'}</p>
        <details><summary>Ver mensagem completa</summary><p className="admin-message-body">{message.message}</p></details>
        <div className="admin-actions">
          {message.status === 'new' && <button className="admin-button" disabled={pending} onClick={event => update(message, 'read', event.currentTarget)}>Marcar como visualizada</button>}
          <a className="admin-button" href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}>Responder por e-mail</a>
          <button className="admin-button" disabled={pending} onClick={event => update(message, message.status === 'responded' ? 'read' : 'responded', event.currentTarget)}>{message.status === 'responded' ? 'Desmarcar respondida' : 'Marcar como respondida'}</button>
          {message.status !== 'archived' && <button className="admin-button" disabled={pending} onClick={event => update(message, 'archived', event.currentTarget)}>Arquivar</button>}
          {message.status === 'archived' && <button className="admin-button" disabled={pending} onClick={event => update(message, 'read', event.currentTarget)}>Desarquivar</button>}
        </div>
      </article>)}
      <nav className="admin-pagination" aria-label="Páginas de mensagens">
        <button className="admin-button" disabled={pending || messages.isFetching || offset === 0} onClick={() => setOffset(offset - 50)}>Anterior</button>
        <span>Página {offset / 50 + 1} · até 50 mensagens</span>
        <button className="admin-button" disabled={pending || messages.isFetching || messages.error || (messages.data?.messages.length ?? 0) < 50} onClick={() => setOffset(offset + 50)}>Próxima</button>
      </nav>
    </section>
    <section id="featured" className="admin-section" aria-labelledby="featured-title" aria-busy={featured.isFetching || repositories.isFetching || pending}>
      <div className="admin-section-heading"><h2 ref={featuredHeading} tabIndex={-1} id="featured-title">Projetos em destaque</h2><span>{selection.length} de 4 projetos selecionados</span></div>
      <p className="muted">Escolha até quatro projetos e organize a seção Projetos da página inicial. A apresentação visual no topo é uma seleção editorial independente.</p>
      {(featured.isLoading || repositories.isLoading) && <p role="status">Carregando projetos…</p>}
      {(featured.error || repositories.error) && <p role="alert">Não foi possível carregar os projetos. <button className="admin-button" onClick={() => { featured.refetch(); repositories.refetch(); }}>Tentar novamente</button></p>}
      {!featured.error && featured.data && <ol className="admin-selection" aria-label="Ordem dos destaques">
        {selection.map((name, index) => <li key={name} tabIndex={-1} ref={node => { if (node) selectedItems.current.set(name, node); else selectedItems.current.delete(name); }}>
          <span><small>{String(index + 1).padStart(2, '0')} / </small>{name}{repositories.data && !repositories.data.some(project => project.slug.toLowerCase() === name.toLowerCase()) && <small> · Indisponível no GitHub</small>}</span>
          <div className="admin-actions"><button className="admin-button" aria-label={`Mover ${name} para cima`} disabled={pending || index === 0} onClick={() => move(index, -1)}>↑</button><button className="admin-button" aria-label={`Mover ${name} para baixo`} disabled={pending || index === selection.length - 1} onClick={() => move(index, 1)}>↓</button><button className="admin-button" aria-label={`Remover ${name}`} disabled={pending} onClick={() => toggle(name)}>Remover</button></div>
        </li>)}
      </ol>}
      {!repositories.error && !featured.error && featured.data && <div className="admin-projects">
        {availableProjects?.map(project => <article key={project.id} className="admin-project">
          <ProjectImage project={project} />
          <div><h3>{project.title}</h3><p>{project.description}</p><span className="muted">{project.language}</span></div>
          <label><input type="checkbox" checked={isSelected(project.slug)} disabled={pending || (!isSelected(project.slug) && selection.length >= 4)} onChange={() => toggle(project.slug)} />Selecionar {project.title}</label>
        </article>)}
        {availableProjects?.length === 0 && <p>Nenhum projeto do site disponível no GitHub.</p>}
      </div>}
      <div className="admin-save"><p>{dirty ? 'Alterações não salvas' : 'Seleção sincronizada com o servidor'}</p><button className="admin-button primary" disabled={!dirty || pending || !featured.data} onClick={save}>{pending ? 'Aguarde…' : 'Salvar destaques'} ↗</button></div>
    </section>
  </main>;
}
