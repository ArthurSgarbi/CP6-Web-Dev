import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import SelectedWorks from '../components/SelectedWorks.jsx';
import Exploration from '../components/Exploration.jsx';
import Journal from '../components/Journal.jsx';
import Footer from '../components/Footer.jsx';
import StudyDialog from '../components/StudyDialog.jsx';
import useReveal from '../hooks/useReveal.js';
import useAnchorNavigation from '../hooks/useAnchorNavigation.js';

export default function HomePage({ projects, projectsQuery, selectedProject, onSelect, onClose, onNext, onPrevious }) {
  const revealRef = useReveal(projects);
  const { activeSection, navigate } = useAnchorNavigation();
  useEffect(() => { document.title = 'Digital Excellence — Portfólio'; }, []);

  return (
    <div id="top" tabIndex="-1" ref={revealRef}>
      <a className="skip-link" href="#main" onClick={(event) => navigate(event, 'main')}>Pular para o conteúdo</a>
      <Header activeSection={activeSection} onNavigate={navigate} />
      <main id="main" tabIndex="-1">
        <Hero navigate={navigate} />
        <SelectedWorks projects={projects} isLoading={projectsQuery.isPending} error={projectsQuery.error}
          isRetrying={projectsQuery.isFetching} onRetry={() => projectsQuery.refetch()} onSelect={onSelect} />
        <Exploration navigate={navigate} />
        <Journal />
      </main>
      <Footer navigate={navigate} />
      <StudyDialog study={selectedProject}
        position={projects.findIndex((project) => project.id === selectedProject?.id) + 1}
        totalCount={projects.length} onClose={onClose} onNext={onNext} onPrevious={onPrevious} />
    </div>
  );
}
