import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import SectionLabel from './SectionLabel.jsx';

const editorial = [
  // Base: github.com/ArthurSgarbi/meu-caixa, README — Contas e metas financeiras.
  {
    id: 'saldo-confirmado',
    project: 'Meu Caixa · Finanças pessoais',
    title: 'Separar previsão de saldo disponível',
    problem: 'Uma despesa prevista ainda não aconteceu. Misturá-la ao saldo confirmado pode distorcer a leitura das finanças.',
    decision: 'As recorrências permanecem como previsões até a confirmação, e os aportes ficam separados das despesas de consumo.',
    learning: 'Um total só é útil quando a interface deixa claro o que entra no cálculo.',
  },
  // Base: github.com/ArthurSgarbi/site-projeto-shopee, README — Publicar na Vercel.
  {
    id: 'demonstracao-estoque',
    project: 'SYNC Mobile · Gestão de estoque',
    title: 'Demonstrar sem expor dados da loja',
    problem: 'Quem está conhecendo o sistema precisa entender o painel de estoque sem acessar informações administrativas da loja.',
    decision: 'A demonstração pública usa dados fictícios e fica separada da área administrativa, que exige autenticação.',
    learning: 'A demonstração faz parte do produto: explicar o uso também exige definir limites de acesso.',
  },
  // Base local: README, src/services/githubApi.js e src/hooks/useGitHubProjects.js.
  {
    id: 'estados-da-interface',
    project: 'Este portfólio · Integração com GitHub',
    title: 'Projetar também para a espera e a falha',
    problem: 'Os projetos vêm do GitHub. Enquanto a resposta não chega — ou se a consulta falha — uma área vazia não explica o que aconteceu.',
    decision: 'A interface oferece estados de carregamento, lista vazia e erro com nova tentativa. O cache reaproveita consultas recentes.',
    learning: 'A experiência precisa fazer sentido antes de os dados chegarem e quando o serviço fica indisponível.',
  },
];

export default function Journal() {
  const [expanded, setExpanded] = useState(0);
  const activeIndex = expanded;

  return (
    <section
      className="journal page-width section-space"
      id="journal"
      tabIndex="-1"
      aria-labelledby="journal-title"
    >
      <SectionLabel number="03">Diário</SectionLabel>

      <div className="journal-grid">
        <div className="journal-intro" data-reveal>
          <h2 id="journal-title">
            As decisões<br />
            por trás de<br />
            cada projeto<span className="title-dot">.</span>
          </h2>
          <p>
            Finanças, estoque e integração de dados trazem perguntas diferentes.
            Aqui compartilho decisões presentes nos projetos e o que elas
            ensinam sobre criar interfaces claras.
          </p>
          <Icon name="spark" className="journal-spark" />
        </div>

        <div className="editorial-list" data-reveal>
          {editorial.map((item, index) => (
            <div
              className={`editorial-item ${activeIndex === index ? 'is-expanded' : ''}`}
              key={item.id}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={activeIndex === index}
                  aria-controls={`journal-panel-${item.id}`}
                  id={`journal-button-${item.id}`}
                  onClick={() => {
                    setExpanded((current) => current === index ? null : index);
                  }}
                >
                  <span className="editorial-number" aria-hidden="true">0{index + 1}</span>
                  <span className="editorial-heading">
                    <span className="editorial-project">{item.project}</span>
                    <span className="editorial-title">{item.title}</span>
                  </span>
                  <span className="editorial-toggle" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" focusable="false">
                      <path d="M5 12h14" />
                      <path className="editorial-toggle-stem" d="M12 5v14" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                className="editorial-panel"
                id={`journal-panel-${item.id}`}
                role="region"
                aria-labelledby={`journal-button-${item.id}`}
                aria-hidden={activeIndex !== index}
                inert={activeIndex !== index}
              >
                <div className="editorial-panel-inner">
                <dl className="editorial-notes">
                  <div>
                    <dt>Problema</dt>
                    <dd>{item.problem}</dd>
                  </div>
                  <div>
                    <dt>Decisão</dt>
                    <dd>{item.decision}</dd>
                  </div>
                  <div className="editorial-learning">
                    <dt>Aprendizado</dt>
                    <dd>{item.learning}</dd>
                  </div>
                </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="journal-footer">
        <p>Veja essas escolhas na prática.</p>
        <Link className="journal-projects-link" to="/#work">
          Explorar os projetos <Icon name="arrow-up-right" />
        </Link>
      </div>
    </section>
  );
}
