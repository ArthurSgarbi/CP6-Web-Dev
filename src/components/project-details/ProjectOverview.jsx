import CaseSection from './CaseSection.jsx';

export default function ProjectOverview({ study }) {
  return (
    <CaseSection id="case-overview" index="01" title="Sobre o projeto">
      <div className="case-overview-grid">
        <aside>
          <dl className="case-facts case-facts-stacked">
            <div>
              <dt>Papel desempenhado</dt>
              <dd>{study.role}</dd>
            </div>
            <div>
              <dt>Duração</dt>
              <dd>{study.duration}</dd>
            </div>
          </dl>
          <p className="case-evidence-note">
            Este estudo apresenta uma leitura técnica do código e da documentação disponíveis.
            Etapas e aprendizados descrevem a implementação observável; a cronologia de
            desenvolvimento depende de confirmação.
          </p>
        </aside>
        <div className="case-narrative">
          {[
            ['Contexto', study.context],
            ['Problema', study.problem],
            ['Objetivo', study.objective],
            ['Público', study.audience],
          ].map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </CaseSection>
  );
}
