import Icon from './Icon.jsx';
import SectionLabel from './SectionLabel.jsx';
import { studies } from '../data/studies.js';

function Study({ study, onSelect }) {
  return (
    <article className={`study study-${study.index}`} data-reveal>
      <button
        className="study-button"
        onClick={() => onSelect(study)}
        aria-label={`Open visual study ${study.index}: ${study.title}`}
        aria-haspopup="dialog"
      >
        <span className="study-image-wrap">
          <img
            src={study.image}
            alt={study.alt}
            width="1200"
            height="1500"
            loading="lazy"
          />
          <span className="study-image-tag">Visual study {study.index}</span>
          <span className="study-open">
            <Icon name="arrow-up-right" />
          </span>
        </span>

        <span className="study-info">
          <span className="study-title-wrap">
            <span className="study-number">{study.index} /</span>
            <span className="study-title">{study.title}</span>
          </span>
          <Icon name="arrow-up-right" />
        </span>

        <span className="study-caption">
          <span>{study.category}</span>
          <span>Illustrative exploration</span>
        </span>
      </button>
    </article>
  );
}

export default function SelectedWorks({ onSelect }) {
  return (
    <section
      className="work page-width section-space"
      id="work"
      tabIndex="-1"
      aria-labelledby="work-title"
    >
      <SectionLabel number="01">Selected works</SectionLabel>

      <div className="section-heading" data-reveal>
        <h2 id="work-title">
          A different<br />
          <span className="muted">point of view.</span>
        </h2>
        <div className="section-intro">
          <span className="collection-tag">Visual studies — 01 / 04</span>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad
            minim veniam, quis nostrud exercitation.
          </p>
        </div>
      </div>

      <div className="work-grid">
        {studies.map((study) => (
          <Study key={study.id} study={study} onSelect={onSelect} />
        ))}
      </div>

      <div className="collection-end">
        <span>End of collection</span>
        <span className="collection-line" />
        <Icon name="spark" />
      </div>
    </section>
  );
}
