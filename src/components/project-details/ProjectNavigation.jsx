import { Link } from 'react-router-dom';

export default function ProjectNavigation({ previous, next, isPending, error }) {
  return (
    <nav className="case-navigation page-width" aria-label="Navegação entre projetos">
      <div className="case-navigation-links">
        {previous && (
          <Link to={previous.detailsUrl} aria-label={`Projeto anterior: ${previous.title}`}>
            <span>← Projeto anterior</span>
            <strong>{previous.title}</strong>
          </Link>
        )}
        {next && (
          <Link
            className="case-navigation-next"
            to={next.detailsUrl}
            aria-label={`Próximo projeto: ${next.title}`}
          >
            <span>Próximo projeto →</span>
            <strong>{next.title}</strong>
          </Link>
        )}
      </div>
      {isPending && <p role="status">Carregando ordem dos projetos…</p>}
      {error && (
        <p className="case-evidence-note">
          A ordem dos projetos está indisponível no momento. A coleção continua acessível
          pelo link abaixo.
        </p>
      )}
      <Link className="text-link" to="/#work">Todos os projetos</Link>
    </nav>
  );
}
