import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import useGitHubProject from '../hooks/useGitHubProject.js';
import ProjectImage from '../components/ProjectImage.jsx';
import ProjectInfo from '../components/ProjectInfo.jsx';
import ProjectSkeleton from '../components/ProjectSkeleton.jsx';
import ProjectsError from '../components/ProjectsError.jsx';
import NotFoundPage from './NotFoundPage.jsx';

export default function ProjectDetailsPage() {
  const { repositoryName } = useParams();
  const { data: project, isPending, error, refetch, isFetching } = useGitHubProject(repositoryName);
  const headingRef = useRef(null);

  useEffect(() => {
    document.title = project ? `${project.title} — Digital Excellence` : 'Projeto — Digital Excellence';
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [repositoryName, project?.title]);

  if (error?.code === 'NOT_FOUND') return <NotFoundPage repositoryName={repositoryName} />;

  return (
    <main className="project-page page-width section-space">
      <Link className="text-link project-back" to="/#work">← Voltar aos projetos</Link>
      <span className="project-eyebrow">Desenvolvimento / GitHub</span>
      <h1 className="project-page-title" ref={headingRef} tabIndex="-1">{project?.title ?? 'Detalhes do projeto'}</h1>
      {isPending ? (
        <div aria-busy="true"><p className="project-note" role="status">Carregando projeto…</p><ProjectSkeleton /></div>
      ) : error && !project ? (
        <ProjectsError error={error} onRetry={() => refetch()} isRetrying={isFetching} />
      ) : project && (
        <>
          {error && <ProjectsError error={error} onRetry={() => refetch()} isRetrying={isFetching} />}
          <div className="project-page-grid">
            <div className="dialog-image-wrap"><ProjectImage project={project} width={1600} height={1100} className="dialog-image" /></div>
            <div><ProjectInfo project={project} /></div>
          </div>
        </>
      )}
    </main>
  );
}
