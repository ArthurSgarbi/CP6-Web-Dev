import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import TextLink from './TextLink.jsx';

const projects = [
  { title: 'Sistema de gastos', image: '/images/sistema-de-gastos.png', alt: 'Tela inicial do Meu Caixa, sistema de controle de finanças pessoais.' },
  { title: 'Sistema de estoque', image: '/images/sistema-de-estoque.png', alt: 'Painel de demonstração da SYNC Mobile com indicadores de vendas e estoque.' },
  { title: 'Site pessoal para surpresa', image: '/images/site-pessoal-para-surpresa.png', alt: 'Site pessoal de um casal com uma mensagem especial e uma fotografia dos dois.' },
];

export default function Hero({ navigate }) {
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const autoPlaying = !focused && !reducedMotion && !pageHidden;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageHidden(document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      preference.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);


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

      <div
        className="hero-carousel"
        data-paused={!autoPlaying}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Projetos em destaque"
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <div className="carousel-window" tabIndex={0} aria-label="Amostras dos projetos">
          <div className="carousel-track">
            {[0, 1].map((copy) => (
              <div className="carousel-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {projects.map((item, index) => (
                  <figure className="carousel-card" key={item.image}>
                    <div className="carousel-screen">
                      <img src={item.image} alt={copy === 0 ? item.alt : ''} width="1917" height="907" fetchPriority={index === 0 ? 'high' : 'auto'} />
                    </div>
                    <figcaption>
                      <span>{item.title}</span>
                      <span className="carousel-number">0{index + 1}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
