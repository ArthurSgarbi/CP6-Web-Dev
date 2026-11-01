import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import TextLink from './TextLink.jsx';
import './hero.css';
import useHydrating from '../hooks/useHydrating.js';

const PAUSE_KEY = 'portfolio-reel-paused';
const projects = [
  { title: 'Meu Caixa', image: 'meu-caixa', caption: 'Tela de acesso · Finanças pessoais', alt: 'Tela de acesso do Meu Caixa, aplicação de finanças pessoais.' },
  { title: 'SYNC Mobile', image: 'sync-mobile', caption: 'Demonstração com dados fictícios · Operação manual', alt: 'Painel de demonstração da SYNC Mobile com indicadores de vendas e estoque e dados fictícios.' },
  { title: 'Memórias a dois', image: 'memorias-a-dois', caption: 'Página pessoal · Narrativa e memórias', alt: 'Página pessoal com uma mensagem e uma fotografia do casal.' },
];

function readPause() {
  try { return sessionStorage.getItem(PAUSE_KEY) === 'true'; }
  catch { return false; }
}

export default function Hero({ navigate }) {
  const hydrating = useHydrating();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(() => hydrating ? false : readPause());
  const [hovered, setHovered] = useState(false);
  const pauseBeforePointerFocus = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(() => hydrating ? false : window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [pageHidden, setPageHidden] = useState(() => hydrating ? false : document.hidden);
  // O foco e a navegação manual desativam a reprodução; a passagem do cursor e a visibilidade apenas a suspendem.
  const autoPlaying = !paused && !hovered && !reducedMotion && !pageHidden;

  useEffect(() => {
    setPaused(readPause());
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

  useEffect(() => {
    if (!autoPlaying) return undefined;
    const timer = window.setInterval(() => setActive(current => (current + 1) % projects.length), 7000);
    return () => window.clearInterval(timer);
  }, [autoPlaying]);

  const setPlaybackPause = value => {
    setPaused(value);
    try { sessionStorage.setItem(PAUSE_KEY, String(value)); } catch { /* O armazenamento é opcional. */ }
  };

  const move = direction => {
    setPlaybackPause(true);
    setActive(current => (current + direction + projects.length) % projects.length);
  };

  return (
    <section className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-overline"><span className="status-label">Arthur Sgarbi / Engenharia de Software</span></div>
      <h1 className="hero-title hero-title-software" id="hero-title">
        <span>IDEIAS EM CÓDIGO.</span>
        <span className="hero-second-line">SOLUÇÕES NA PRÁTICA.<Icon name="spark" className="hero-spark" /></span>
      </h1>
      <div className="hero-support hero-support-software">
        <div className="hero-description">
          <p>Sou Arthur Sgarbi, estudante de Engenharia de Software na FIAP. Desenvolvo sites e aplicações para organizar informações e simplificar tarefas, de finanças pessoais à gestão de uma loja.</p>
          <div className="hero-links">
            <TextLink href="#work" onClick={event => navigate(event, 'work')}>Explore os trabalhos selecionados</TextLink>
            <TextLink href="#contato" onClick={event => navigate(event, 'contato')}>Vamos conversar</TextLink>
          </div>
        </div>
        <div className="project-reel" role="region" aria-roledescription="carrossel" aria-label="Amostras de interfaces"
          data-paused={!autoPlaying}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPlaybackPause(true);
          }}
          onKeyDown={event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              move(event.key === 'ArrowLeft' ? -1 : 1);
            }
          }}>
          <div className="project-reel-heading">
            <span>Amostras de interfaces</span>
            <span className="project-reel-count">{active + 1} / {projects.length}</span>
          </div>
          <div id="project-reel-slides" className="project-reel-slides" aria-live={autoPlaying ? 'off' : 'polite'} aria-atomic="true">
            {projects.map((project, index) => (
              <figure className="project-reel-slide" key={project.image} hidden={index !== active} aria-roledescription="slide" aria-label={`${index + 1} de ${projects.length}: ${project.title}`}>
                <div className="project-reel-screen">
                  <img src={`/images/hero/${project.image}-1280.webp`}
                    srcSet={`/images/hero/${project.image}-640.webp 640w, /images/hero/${project.image}-1280.webp 1280w, /images/hero/${project.image}-1600.webp 1600w`}
                    sizes="(max-width: 600px) calc(100vw - 44px), (max-width: 1640px) 91vw, 1480px"
                    alt={project.alt} width="1600" height="760" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
                </div>
                <figcaption><strong>{project.title}</strong><span>{project.caption}</span></figcaption>
              </figure>
            ))}
          </div>
          <div className="project-reel-controls">
            {reducedMotion ? <span className="project-reel-motion">Navegação manual · movimento reduzido</span> :
              <button type="button" className="project-reel-playback"
                onPointerDown={() => { pauseBeforePointerFocus.current = paused; }}
                onPointerCancel={() => { pauseBeforePointerFocus.current = null; }}
                onClick={event => {
                  // O foco pelo ponteiro pausa antes do clique: respeite a ação originalmente acionada.
                  const wasPaused = event.detail > 0 ? pauseBeforePointerFocus.current ?? paused : paused;
                  pauseBeforePointerFocus.current = null;
                  setPlaybackPause(!wasPaused);
                }} aria-controls="project-reel-slides">
                {paused ? 'Reproduzir carrossel' : 'Pausar carrossel'}
              </button>}
            <div className="project-reel-navigation">
              <button type="button" onClick={() => move(-1)} aria-label="Interface anterior" aria-controls="project-reel-slides"><Icon name="arrow-left" /></button>
              <button type="button" onClick={() => move(1)} aria-label="Próxima interface" aria-controls="project-reel-slides"><Icon name="arrow-right" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
