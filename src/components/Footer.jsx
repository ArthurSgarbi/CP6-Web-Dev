import Icon from './Icon.jsx';
import { Link } from 'react-router-dom';

export default function Footer({ navigate }) {
  return (
    <footer className="footer" id="footer">
      <div className="page-width">
        <div className="footer-top">
          <span className="status-label">
            Sempre explorando.
          </span>
          <a
            className="back-top"
            href="#top"
            onClick={(event) => navigate(event, 'top')}
          >
            Voltar ao topo
            <Icon name="arrow-up-right" />
          </a>
        </div>

        <a
          className="footer-title"
          href="#work"
          onClick={(event) => navigate(event, 'work')}
        >
          <span>Mantenha a curiosidade<span className="title-dot">.</span></span>
          <Icon name="arrow-up-right" />
        </a>

        <div className="footer-bottom">
          <span>Arthur Sgarbi © 2026</span>
          <span>Engenharia de Software · FIAP</span>
          <Link to="/dashboard">Acessar painel <Icon name="arrow-up-right" /></Link>
        </div>
      </div>
    </footer>
  );
}
