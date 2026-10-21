import Icon from './Icon.jsx';
import TextLink from './TextLink.jsx';

export default function Hero({ navigate }) {
  return (
    <section className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-overline">
        <span className="status-label">
          <span className="status-dot" />
          Um estudo sobre conhecimento e carreira
        </span>
      </div>

      <h1 className="hero-title hero-title-business" id="hero-title">
        <span>SITES QUE FARÃO</span>
        <span>SEU NEGÓCIO</span>
        <span className="hero-second-line">
          CRESCER
          <Icon name="spark" className="hero-spark" />
        </span>
      </h1>

      <div className="hero-support">
        <span className="hero-index">(ROLE PARA DESCOBRIR)</span>
        <div className="hero-description">
          <p>
            Como um estudante de Engenharia de Software, construí com meus estudos sites onde sua pequena a grande empresa pode encontrar uma grande mudança para a concorrência
          </p>
          <TextLink
            href="#work"
            onClick={(event) => navigate(event, 'work')}
          >
            Explore os trabalhos selecionados
          </TextLink>
        </div>
      </div>

      <a
        className="hero-art"
        href="#work"
        onClick={(event) => navigate(event, 'work')}
        aria-label="Explore the collection of visual studies"
      >
        <img
          src="/images/hero-abstract.jpg"
          alt="Flowing abstract waves in violet, cyan and warm orange."
          width="1800"
          height="1368"
          fetchPriority="high"
        />
        <span className="art-topline">
          <span>01 — Abstract perspectives</span>
          <Icon name="plus" />
        </span>
        <span className="art-bottomline">
          <span>Form. Color. Possibility.</span>
          <span className="art-scroll">
            <Icon name="arrow-down" />
          </span>
        </span>
      </a>

      <div className="hero-caption">
        <span>Art in the details.</span>
        <span>Illustrative visual study / Unsplash</span>
        <span aria-hidden="true">↓</span>
      </div>
    </section>
  );
}
