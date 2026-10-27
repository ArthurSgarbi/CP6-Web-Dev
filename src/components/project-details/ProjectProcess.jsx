import CaseSection from './CaseSection.jsx';

export default function ProjectProcess({ steps }) {
  return (
    <div className="case-process-band">
      <div className="page-width">
        <CaseSection id="case-process" index="03" title="Processo de desenvolvimento">
          <p className="case-section-intro">
            Da necessidade à estrutura implementada. As etapas abaixo organizam as evidências
            do projeto, sem atribuir uma sequência histórica não documentada.
          </p>
          <ol className="case-process-list">
            {steps.map((step, index) => (
              <li key={step.id}>
                <span className="case-step-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className="case-step-detail-grid">
                    {step.decisions?.length > 0 && (
                      <div>
                        <h4>Decisões observáveis</h4>
                        <ul className="case-bullet-list">
                          {step.decisions.map((text) => <li key={text}>{text}</li>)}
                        </ul>
                      </div>
                    )}
                    {step.deliverables?.length > 0 && (
                      <div>
                        <h4>Entregáveis no repositório</h4>
                        <ul className="case-bullet-list">
                          {step.deliverables.map((text) => <li key={text}>{text}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                  {step.difficulty && (
                    <p><strong>Dificuldade técnica: </strong>{step.difficulty}</p>
                  )}
                  {step.solution && (
                    <p><strong>Solução no código: </strong>{step.solution}</p>
                  )}
                  {step.technologies?.length > 0 && (
                    <p className="case-step-technologies">{step.technologies.join(' / ')}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </CaseSection>
      </div>
    </div>
  );
}
