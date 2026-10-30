import Icon from './Icon.jsx';
import formatDate from '../utils/formatDate.js';

export default function ProjectInfo({ project, descriptionId }) {
  return (
    <>
      <p className="dialog-description" id={descriptionId}>{project.description}</p>
      <dl className="project-facts">
        <div><dt>Linguagens e tecnologias</dt><dd><ul className="project-technologies" aria-label="Linguagens e tecnologias">{(project.technologies ?? [project.language]).map((technology) => <li key={technology}>{technology}</li>)}</ul></dd></div>
        <div><dt>Última atualização</dt><dd><time dateTime={project.updatedAt}>{formatDate(project.updatedAt)}</time></dd></div>
        {project.stars > 0 && <div><dt>Estrelas no GitHub</dt><dd>{project.stars.toLocaleString('pt-BR')}</dd></div>}
      </dl>
      {project.topics.length > 0 && (
        <ul className="project-topics" aria-label="Tópicos do repositório">
          {project.topics.map((topic) => <li key={topic}>{topic}</li>)}
        </ul>
      )}
      {(project.fork || project.archived) && (
        <p className="project-note">{project.archived ? 'Repositório arquivado.' : 'Fork de outro repositório.'}</p>
      )}
      <div className="project-actions">
        <a className="project-action" href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
          Ver código no GitHub <Icon name="arrow-up-right" />
        </a>
        {project.liveUrl && (
          <a className="project-action project-action-secondary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            {project.liveLabel ?? 'Acessar projeto'} <Icon name="arrow-up-right" />
          </a>
        )}
      </div>
    </>
  );
}
