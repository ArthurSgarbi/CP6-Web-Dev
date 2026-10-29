import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import SectionLabel from './SectionLabel.jsx';
import ProjectImage from './ProjectImage.jsx';
import ProjectSkeleton from './ProjectSkeleton.jsx';
import ProjectsError from './ProjectsError.jsx';
import ProjectsEmpty from './ProjectsEmpty.jsx';
import formatDate from '../utils/formatDate.js';

function ProjectCard({ project, index, onSelect }) {
  const number = String(index + 1).padStart(2, '0');
  return (
    <article className={`study study-0${index % 4 + 1}`} data-reveal>
      <button className="study-button" type="button" onClick={() => onSelect(project)} aria-label={`Abrir detalhes de ${project.title}`} aria-haspopup="dialog">
        <span className="study-image-wrap">
          <ProjectImage project={project} />
          <span className="study-image-tag">Projeto real · GitHub</span>
          <span className="study-open"><Icon name="arrow-up-right" /></span>
        </span>
      </button>
      <div className="study-info">
        <div className="study-title-wrap">
          <span className="study-number" aria-hidden="true">{number} /</span>
          <h3 className="study-title"><Link to={project.detailsUrl}>{project.title}</Link></h3>
        </div>
        <Icon name="arrow-up-right" />
      </div>
      <p className="project-description">{project.description}</p>
      <div className="study-caption">
        <span>{project.language}</span>
        <span>Atualizado em <time dateTime={project.updatedAt}>{formatDate(project.updatedAt)}</time></span>
      </div>
      <Link className="project-details-link" to={project.detailsUrl} aria-label={`Página do projeto ${project.title}`}>Página do projeto <Icon name="arrow-up-right" /></Link>
    </article>
  );
}

export default function SelectedWorks({ projects, isLoading, error, isRetrying, onRetry, onSelect }) {
  const hasProjects = projects.length > 0;
  return (
    <section className="work page-width section-space" id="work" tabIndex="-1" aria-labelledby="work-title">
      <SectionLabel number="01">Projetos de desenvolvimento</SectionLabel>
      <div className="section-heading" data-reveal>
        <h2 id="work-title">PROJETOS</h2>
        <div className="section-intro">
          <span className="collection-tag">Repositórios públicos / GitHub</span>
          <p>Projetos reais, carregados automaticamente do GitHub e selecionados para este portfólio.</p>
        </div>
      </div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isLoading ? 'Carregando projetos do GitHub…' : hasProjects
          ? `${projects.length} ${projects.length === 1 ? 'projeto carregado' : 'projetos carregados'} do GitHub.` : ''}
      </div>
      {error && <ProjectsError error={error} onRetry={onRetry} isRetrying={isRetrying} />}
      <div className="work-grid" aria-busy={isLoading}>
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => <ProjectSkeleton key={index} index={index} />)
          : hasProjects
            ? projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onSelect={onSelect} />)
            : !error && <ProjectsEmpty />}
      </div>
      <div className="collection-end">
        <span>{hasProjects ? `${projects.length} ${projects.length === 1 ? 'projeto público' : 'projetos públicos'}` : 'Coleção de projetos'}</span>
        <span className="collection-line" /><Icon name="spark" />
      </div>
    </section>
  );
}
