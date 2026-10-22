import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import useGitHubProjects from './hooks/useGitHubProjects.js';

const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetailsPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const EMPTY_PROJECTS = [];

export default function App() {
  const { pathname } = useLocation();
  const projectsQuery = useGitHubProjects({ enabled: pathname === '/' });
  const projects = projectsQuery.data ?? EMPTY_PROJECTS;
  const [selectedId, setSelectedId] = useState(null);
  const selectedProject = projects.find((project) => project.id === selectedId) ?? null;

  useEffect(() => {
    if (pathname !== '/' || (selectedId !== null && !selectedProject)) setSelectedId(null);
  }, [pathname, selectedId, selectedProject]);

  const changeProject = (direction) => setSelectedId((currentId) => {
    if (!projects.length) return null;
    const index = projects.findIndex((project) => project.id === currentId);
    if (index < 0) return null;
    return projects[(index + direction + projects.length) % projects.length].id;
  });

  return (
    <Suspense fallback={<main className="project-page page-width section-space" role="status">Carregando página…</main>}>
      <Routes>
        <Route path="/" element={
          <HomePage projects={projects} projectsQuery={projectsQuery} selectedProject={selectedProject}
            onSelect={(project) => setSelectedId(project.id)} onClose={() => setSelectedId(null)}
            onNext={() => changeProject(1)} onPrevious={() => changeProject(-1)} />
        } />
        <Route path="/projetos/:repositoryName" element={<ProjectDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
