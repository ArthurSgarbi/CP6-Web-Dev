import { useState } from 'react';
import SectionLabel from './SectionLabel.jsx';
import TextLink from './TextLink.jsx';

const steps = [
  {
    title: 'Entender',
    description: 'Começo pelo que o projeto precisa permitir fazer. No Meu Caixa, isso envolve organizar as finanças pessoais; no projeto Shopee, acompanhar estoque e gastos. Esses objetivos ajudam a definir quais informações e ações precisam aparecer na interface.',
  },
  {
    title: 'Planejar',
    description: 'Defino o que aparece primeiro e o que precisa de uma tela própria. Neste portfólio, os cards apresentam cada projeto de forma resumida, enquanto a página de detalhes reúne mais informações e as tecnologias utilizadas.',
  },
  {
    title: 'Desenvolver',
    description: 'Divido a interface em componentes e conecto os dados que ela precisa exibir. Aqui, uso React e a API do GitHub para carregar os repositórios. A lista tem estados de carregamento, erro e ausência de projetos, além dos cards com os dados recebidos.',
  },
  {
    title: 'Validar',
    description: 'Confiro se a interação corresponde à ação de quem usa. Nesta seção, por exemplo, passar o mouse revela os detalhes, enquanto o clique ou o teclado permitem manter uma etapa aberta. Uso comportamentos concretos como esse para orientar a revisão e os ajustes.',
  },
];

export default function Exploration({ navigate }) {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [pinnedSteps, setPinnedSteps] = useState([]);

  return (
    <section
      className="exploration section-space"
      id="exploration"
      tabIndex="-1"
      aria-label="Processo / Do objetivo à interface"
    >
      <div className="page-width">
        <SectionLabel number="02">Processo / Do objetivo à interface</SectionLabel>

        <div className="exploration-intro" data-reveal>
          <h2 id="exploration-title">
            Como desenvolvo<br />
            <span>meus projetos</span>
          </h2>
          <p>
            Sou Arthur Sgarbi, estudante de Engenharia de Software da FIAP.
            Desenvolvo projetos para aplicar o que estudo, de controle financeiro
            a um site pessoal. Abaixo, explico as escolhas por trás do código
            com exemplos dos trabalhos deste portfólio.
          </p>
        </div>

        <div className="exploration-grid">
          <figure className="exploration-art" data-reveal>
            <div
              className="process-art"
              role="img"
              aria-label="Três telas ilustram a evolução de um rascunho para uma estrutura e, por fim, uma interface pronta."
            >
              <div className="process-card process-sketch" aria-hidden="true">
                <span className="process-card-label">01 / Rascunho</span>
                <span className="process-sketch-title" />
                <span className="process-sketch-line" />
                <span className="process-sketch-line short" />
                <span className="process-sketch-box" />
                <span className="process-sketch-button" />
              </div>
              <div className="process-card process-structure" aria-hidden="true">
                <span className="process-card-label">02 / Estrutura</span>
                <span className="process-window-bar" />
                <span className="process-structure-title" />
                <span className="process-structure-line" />
                <span className="process-structure-line short" />
                <span className="process-structure-grid"><span /><span /></span>
                <span className="process-structure-button" />
              </div>
              <div className="process-card process-finished" aria-hidden="true">
                <span className="process-card-label">03 / Interface</span>
                <span className="process-window-bar" />
                <span className="process-finished-image" />
                <span className="process-finished-title" />
                <span className="process-finished-line" />
                <span className="process-finished-button" />
              </div>
            </div>
            <figcaption className="exploration-art-caption">
              <span>Do rascunho à experiência final</span>
              <span>Processo de criação</span>
            </figcaption>
          </figure>

          <div className="exploration-copy" data-reveal>
            <p className="exploration-process-label">Meu processo de trabalho</p>
            <ol className="exploration-steps">
              {steps.map(({ title, description }, index) => (
                <li key={title}>
                  <span className="exploration-step-number" aria-hidden="true">0{index + 1}</span>
                  <details
                    className="exploration-step-details"
                    open={hoveredStep === index || pinnedSteps.includes(index)}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'mouse') setHoveredStep(index);
                    }}
                    onPointerLeave={() => setHoveredStep(null)}
                  >
                    <summary onClick={(event) => {
                      event.preventDefault();
                      setPinnedSteps((current) => current.includes(index)
                        ? current.filter((step) => step !== index)
                        : [...current, index]);
                    }}>
                      <h3><span className="exploration-step-title">{title}</span><span className="exploration-step-toggle" aria-hidden="true">+</span></h3>
                      <p className="exploration-step-summary">{description.split('. ')[0]}.</p>
                    </summary>
                    <p className="exploration-step-full">{description.split('. ').slice(1).join('. ')}</p>
                  </details>
                </li>
              ))}
            </ol>
            <TextLink
              href="#work"
              onClick={(event) => navigate(event, 'work')}
            >
              Ver projetos na prática
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
