import CaseSection from './CaseSection.jsx';

export default function ProjectOverview({ study }) {
  return (
    <CaseSection id="case-overview" index="01" title="Sobre o projeto">
      <div className="case-overview-grid">
        <aside>
          <dl className="case-facts case-facts-stacked">
            <div>
              <dt>Contribuição individual</dt>
              <dd>{study.role}</dd>
            </div>
          </dl>
          <p className="case-evidence-note">
            {study.limitation}
          </p>
        </aside>
        <div className="case-narrative">
          {[
            ['Contexto e público', study.context],
            ['Problema', study.problem],
            ['Decisão e implementação', study.implementation],
            ['Evidência', study.evidence],
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
