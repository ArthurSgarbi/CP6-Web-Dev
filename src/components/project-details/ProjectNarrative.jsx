import CaseSection from './CaseSection.jsx';

export function ProjectChallenge({ challenges }) {
  return (
    <CaseSection id="case-challenge" index="02" title="O desafio">
      <div className="case-editorial-list">
        {challenges.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <div>
              <p>{item.description}</p>
              {item.solution && <p><strong>Como funciona: </strong>{item.solution}</p>}
            </div>
          </article>
        ))}
      </div>
    </CaseSection>
  );
}

export function ProjectFeatures({ features }) {
  return (
    <CaseSection id="case-features" index="05" title="Principais funcionalidades">
      <div className="case-editorial-list">
        {features.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <div>
              <p>{item.description}</p>
              <p className="case-benefit"><strong>Para quem utiliza: </strong>{item.benefit}</p>
            </div>
          </article>
        ))}
      </div>
    </CaseSection>
  );
}

export function ProjectResults({ study }) {
  return (
    <CaseSection id="case-results" index="07" title="Resultados e aprendizados">
      <div className="case-results-grid">
        <div>
          <h3>O que foi construído</h3>
          <ul className="case-bullet-list">
            {study.results.map((text) => <li key={text}>{text}</li>)}
          </ul>
        </div>
        <div>
          <h3>Aprendizados técnicos</h3>
          <ul className="case-bullet-list">
            {study.learnings.map((text) => <li key={text}>{text}</li>)}
          </ul>
        </div>
      </div>
    </CaseSection>
  );
}

export function ProjectNextSteps({ study }) {
  return (
    <CaseSection id="case-next" index="08" title="Próximos passos">
      <ul className="case-next-list">
        {study.nextSteps.map((text, index) => (
          <li key={text}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')} /</span>
            <p>{text}</p>
          </li>
        ))}
      </ul>
      {study.pending?.length > 0 && (
        <details className="case-pending">
          <summary>Informações a confirmar com o proprietário</summary>
          <ul className="case-bullet-list">
            {study.pending.map((text) => <li key={text}>{text}</li>)}
          </ul>
        </details>
      )}
      {study.sources?.length > 0 && (
        <div className="case-sources">
          <h3>Fontes do estudo</h3>
          <ul>
            {study.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CaseSection>
  );
}
