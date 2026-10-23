import SectionLabel from './SectionLabel.jsx';
import TextLink from './TextLink.jsx';

const steps = [
  {
    title: 'Entender',
    description: 'Converso sobre o público, a necessidade do negócio e a ação que o site deve facilitar. Procuro entender as dúvidas de quem visita, os diferenciais da proposta e o que precisa ficar claro desde o primeiro contato. Essa escuta orienta as escolhas do projeto e conecta a experiência aos objetivos de quem oferece e de quem procura.',
  },
  {
    title: 'Planejar',
    description: 'Organizo o conteúdo e o caminho de navegação para que cada informação tenha um propósito. Defino a ordem das seções, a hierarquia dos textos e os pontos de destaque que ajudam a apresentar a proposta. Antes de desenvolver, penso em como conduzir a pessoa da descoberta ao próximo passo, com clareza e sem etapas desnecessárias.',
  },
  {
    title: 'Desenvolver',
    description: 'Transformo a estrutura em uma interface responsiva, legível e simples de usar. Trabalho o layout, os componentes e as interações para que a experiência faça sentido no celular e no computador. Durante a implementação, cuido da organização do código, da acessibilidade e do desempenho, criando uma base que facilite futuras melhorias.',
  },
  {
    title: 'Validar',
    description: 'Reviso o resultado em diferentes telas e ajusto o que atrapalha a compreensão ou o uso. Confiro a leitura dos textos, os caminhos de navegação e o funcionamento de links e botões para identificar pontos de fricção. A partir dessa revisão e dos feedbacks recebidos, refino os detalhes para entregar uma experiência mais consistente e alinhada ao objetivo inicial.',
  },
];

export default function Exploration({ navigate }) {
  return (
    <section
      className="exploration section-space"
      id="exploration"
      tabIndex="-1"
      aria-labelledby="exploration-title"
    >
      <div className="page-width">
        <SectionLabel number="02">Exploração / Do objetivo à interface</SectionLabel>

        <div className="exploration-intro" data-reveal>
          <h2 id="exploration-title">
            Ideias que viram<br />
            <span>experiências úteis.</span>
          </h2>
          <p>
            Um site útil ajuda as pessoas a entender o que você oferece, confiar
            na sua proposta e encontrar o próximo passo. Como estudante de
            Engenharia de Software, uso um processo claro para transformar essa
            intenção em uma experiência fácil de usar.
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
            <p className="exploration-process-label">Quatro decisões, um objetivo</p>
            <ol className="exploration-steps">
              {steps.map(({ title, description }, index) => (
                <li key={title}>
                  <span className="exploration-step-number" aria-hidden="true">0{index + 1}</span>
                  <details className="exploration-step-details">
                    <summary>
                      <h3>{title}<span className="exploration-step-toggle" aria-hidden="true">+</span></h3>
                      <p className="exploration-step-summary">{description.split('. ')[0]}.</p>
                    </summary>
                    <p className="exploration-step-full">{description}</p>
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
