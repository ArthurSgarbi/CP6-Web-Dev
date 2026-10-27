import CaseSection from './CaseSection.jsx';

export default function ProjectArchitecture({ items }) {
  return (
    <CaseSection id="case-architecture" index="04" title="Arquitetura e tecnologias">
      <p className="case-section-intro">
        Como as partes se conectam e qual responsabilidade cada uma assume.
      </p>
      <ol className="case-architecture-flow" aria-label="Fluxo e responsabilidades da arquitetura">
        {items.map((item, index) => (
          <li key={item.title}>
            <span className="case-flow-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
              {index < items.length - 1 && ' ↓'}
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ol>
    </CaseSection>
  );
}
