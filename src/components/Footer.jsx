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
          aria-label="Revisitar os estudos visuais"
        >
          <span>Mantenha a curiosidade<span className="title-dot">.</span></span>
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
          <span>Explorações de design © 2026</span>
          <span>Arthur Sgarbi Sousa</span>
          <a href="#work" onClick={(event) => navigate(event, 'work')}>
            CP6 de Web Dev <Icon name="arrow-up-right" />
          </a>
        </div>
      </div>
    </footer>
  );
}
