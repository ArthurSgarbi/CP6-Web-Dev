import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import useHydrating from '../hooks/useHydrating.js';

// Alvos de âncora estáveis permitem que fragmentos diretos da URL, links do menu e foco ativem uma seção
// mesmo quando seu módulo ainda não foi solicitado.
const sections = {
  exploration: lazy(() => import('./Exploration.jsx')),
  journal: lazy(() => import('./Journal.jsx')),
  contato: lazy(() => import('./Contact.jsx')),
};

export default function DeferredSection({ id, label, ...props }) {
  const hydrating = useHydrating();
  const [active, setActive] = useState(() => !hydrating && (!('IntersectionObserver' in window) || window.location.hash === `#${id}`));
  const anchor = useRef(null);
  useEffect(() => {
    if (active) return;
    if (window.location.hash === `#${id}` || !('IntersectionObserver' in window)) { setActive(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setActive(true);
    }, { rootMargin: '600px 0px' });
    observer.observe(anchor.current);
    return () => observer.disconnect();
  }, [active]);
  const Component = sections[id];
  const placeholder = <div className="deferred-placeholder page-width" role="status" aria-label={`Carregando ${label}`} />;
  return <div id={id} tabIndex={-1} ref={anchor} className="deferred-section" onFocusCapture={() => setActive(true)}>
    {active ? <Suspense fallback={placeholder}><Component {...props} id={null} /></Suspense> : placeholder}
  </div>;
}
