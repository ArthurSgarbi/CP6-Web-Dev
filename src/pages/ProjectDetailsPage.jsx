import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import useGitHubProject from '../hooks/useGitHubProject.js';
import { getProjectCaseStudy } from '../data/projectCaseStudies.js';
import ProjectHero from '../components/project-details/ProjectHero.jsx';
import ProjectOverview from '../components/project-details/ProjectOverview.jsx';
import { ProjectChallenge } from '../components/project-details/ProjectNarrative.jsx';
import ProjectsError from '../components/ProjectsError.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import './project-case-study.css';

function CaseSkeleton() {
  return (
    <div className="case-loading page-width" aria-busy="true">
      <p role="status">Carregando projeto…</p>
      <div className="skeleton-line skeleton-title" />
      <div className="case-skeleton-cover skeleton-image" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-short" />
    </div>
  );
}

export default function ProjectDetailsPage() {
  const { repositoryName } = useParams();
  const { data: project, isPending, error, refetch, isFetching } = useGitHubProject(repositoryName);
  const study = getProjectCaseStudy(project?.slug ?? repositoryName);
  const headingRef = useRef(null);

  useEffect(() => {
    if (error?.code === 'NOT_FOUND') return;
    document.title = project ? `${project.title} | Arthur Sgarbi` : 'Projeto | Arthur Sgarbi';
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [repositoryName, project?.title, error?.code]);

  useEffect(() => {
    if (!project) return undefined;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute('content');
    description?.setAttribute('content', study?.summary ?? project.description);
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${window.location.origin}/projetos/${encodeURIComponent(project.slug)}`;
    document.head.append(canonical);
    return () => {
      if (description && previousDescription !== null) description.setAttribute('content', previousDescription);
      canonical.remove();
    };
  }, [project?.slug, project?.description, study?.summary]);

  if (error?.code === 'NOT_FOUND') {
    return <NotFoundPage repositoryName={repositoryName} />;
  }

  if (isPending) {
    return (
      <main className="case-study">
        <div className="page-width case-state-back">
          <Link className="text-link" to="/#work">← Voltar aos projetos</Link>
        </div>
        <CaseSkeleton />
      </main>
    );
  }

  if (error && !project) {
    return (
      <main className="case-study">
        <div className="page-width section-space">
          <Link className="text-link" to="/#work">← Voltar aos projetos</Link>
          <h1 className="project-page-title">Detalhes do projeto</h1>
          <ProjectsError error={error} onRetry={() => refetch()} isRetrying={isFetching} />
        </div>
      </main>
    );
  }

  return (
    <main className="case-study" key={project.slug}>
      {error && (
        <div className="page-width">
          <ProjectsError error={error} onRetry={() => refetch()} isRetrying={isFetching} />
        </div>
      )}
      <ProjectHero project={project} study={study} headingRef={headingRef} />
      {study ? (
        <div className="page-width">
          <ProjectOverview study={study} />
          <ProjectChallenge challenges={study.challenges} />
        </div>
      ) : (
        <section className="case-section page-width" aria-labelledby="case-unavailable">
          <h2 id="case-unavailable">Estudo de caso em preparação</h2>
          <p className="case-section-intro">
            Este repositório existe no GitHub. O contexto, o processo e as imagens adicionais
            ainda não foram documentados neste portfólio. Os dados e links acima são fornecidos pela API.
          </p>
        </section>
      )}
      <nav className="case-ending page-width" aria-label="Continuar a navegação">
        <Link className="text-link" to="/#work">← Todos os projetos</Link>
        <Link className="text-link" to="/#contato">Conversar sobre um projeto ↗</Link>
      </nav>
    </main>
  );
}
