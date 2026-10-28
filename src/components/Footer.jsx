import Icon from './Icon.jsx';
import { Link } from 'react-router-dom';

export default function Footer({ navigate }) {
  return (
    <footer className="footer" id="footer">
      <div className="page-width">
        <div className="footer-top">
          <span className="status-label">
            <span className="status-dot" />
            Always exploring.
          </span>
          <a
            className="back-top"
            href="#top"
            onClick={(event) => navigate(event, 'top')}
          >
            Back to top
            <Icon name="arrow-up-right" />
          </a>
        </div>

        <a
          className="footer-title"
          href="#work"
          onClick={(event) => navigate(event, 'work')}
          aria-label="Revisit the visual studies"
        >
          <span>Stay curious<span className="title-dot">.</span></span>
          <Icon name="arrow-up-right" />
        </a>

        <div className="footer-admin" aria-labelledby="footer-admin-title">
          <div>
            <p id="footer-admin-title">Área do proprietário</p>
            <span>Gerencie suas mensagens e os projetos em destaque.</span>
          </div>
          <Link className="footer-admin-link" to="/dashboard">
            Acessar dashboard <Icon name="arrow-up-right" />
          </Link>
        </div>

        <div className="footer-bottom">
          <span>Digital Excellence © 2026</span>
          <span>Anonymous by design.</span>
          <a href="#work" onClick={(event) => navigate(event, 'work')}>
            Visual studies only <Icon name="arrow-up-right" />
          </a>
        </div>
      </div>
    </footer>
  );
}
