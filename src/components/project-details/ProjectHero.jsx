import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import ProjectImage from '../ProjectImage.jsx';
import formatDate from '../../utils/formatDate.js';

export default function ProjectHero({ project, study, headingRef }) {
  return (
    <header className="case-hero page-width">
      <Link className="text-link project-back" to="/#work">← Voltar aos projetos</Link>
      <span className="project-eyebrow">
        {study?.eyebrow ?? 'Projeto de desenvolvimento'} / {project.language}
      </span>
      <h1 className="project-page-title" ref={headingRef} tabIndex="-1">{project.title}</h1>
      <div className="case-hero-grid">
        <div>
          {study && <p className="case-headline">{study.headline}</p>}
          <p className="case-api-description">{project.description}</p>
          {study && <p className="case-summary">{study.summary}</p>}
        </div>
        <div className="case-hero-meta">
          <dl className="case-facts">
            <div>
              <dt>Linguagem principal</dt>
              <dd>{project.language}</dd>
            </div>
            <div>
              <dt>Última atualização</dt>
              <dd><time dateTime={project.updatedAt}>{formatDate(project.updatedAt)}</time></dd>
            </div>
            <div>
              <dt>Estrelas no GitHub</dt>
              <dd>{project.stars.toLocaleString('pt-BR')}</dd>
            </div>
          </dl>
          {project.topics.length > 0 && (
            <ul className="project-topics" aria-label="Tópicos do repositório">
              {project.topics.map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
          )}
          {(project.fork || project.archived) && (
            <p className="project-note">
              {project.archived ? 'Repositório arquivado.' : 'Fork de outro repositório.'}
            </p>
          )}
          <div className="project-actions">
            <a
              className="project-action"
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver código no GitHub <Icon name="arrow-up-right" />
            </a>
            {project.liveUrl && (
              <a
                className="project-action project-action-secondary"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar projeto <Icon name="arrow-up-right" />
              </a>
            )}
          </div>
        </div>
      </div>
      <figure className="case-cover">
        <div className="case-cover-frame">
          <ProjectImage
            project={project}
            width={1600}
            height={1100}
            className="case-cover-image"
            loading="eager"
          />
        </div>
        <figcaption>
          <span>01 / Apresentação do projeto</span>
          <span>
            {study?.coverCaption ?? 'Capa de apresentação. Na ausência do arquivo, é utilizada uma composição abstrata.'}
          </span>
        </figcaption>
      </figure>
    </header>
  );
}
