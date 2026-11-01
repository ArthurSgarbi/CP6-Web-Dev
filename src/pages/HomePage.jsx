import { lazy, Suspense, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import SelectedWorks from '../components/SelectedWorks.jsx';
import DeferredSection from '../components/DeferredSection.jsx';
import Footer from '../components/Footer.jsx';
import useReveal from '../hooks/useReveal.js';
import useAnchorNavigation from '../hooks/useAnchorNavigation.js';
import { homeMetadata, setPageMetadata } from '../utils/pageMetadata.js';

const StudyDialog = lazy(() => import('../components/StudyDialog.jsx'));

export default function HomePage({ projects, projectsQuery, selectedProject, onSelect, onClose, onNext, onPrevious }) {
  const revealRef = useReveal(projects);
  const { activeSection, navigate } = useAnchorNavigation();
  useEffect(() => setPageMetadata(homeMetadata), []);

  return (
    <div id="top" tabIndex="-1" ref={revealRef}>
      <a className="skip-link" href="#main" onClick={(event) => navigate(event, 'main')}>Pular para o conteúdo</a>
      <Header activeSection={activeSection} onNavigate={navigate} />
      <main id="main" tabIndex="-1">
        <Hero navigate={navigate} />
        <SelectedWorks projects={projects} isLoading={projectsQuery.isPending} error={projectsQuery.error}
          isRetrying={projectsQuery.isFetching} onRetry={() => projectsQuery.refetch()} onSelect={onSelect} emptyReason={projectsQuery.emptyReason} />
        <DeferredSection id="exploration" label="Processo" navigate={navigate} />
        <DeferredSection id="journal" label="Diário" />
        <DeferredSection id="contato" label="Contato" />
      </main>
      <Footer navigate={navigate} />
      {selectedProject && <Suspense fallback={<p className="sr-only" role="status">Abrindo prévia…</p>}><StudyDialog study={selectedProject}
        position={projects.findIndex((project) => project.id === selectedProject?.id) + 1}
        totalCount={projects.length} onClose={onClose} onNext={onNext} onPrevious={onPrevious} /></Suspense>}
    </div>
  );
}
