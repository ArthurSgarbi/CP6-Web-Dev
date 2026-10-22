import SectionLabel from './SectionLabel.jsx';
import TextLink from './TextLink.jsx';

export default function Exploration({ navigate }) {
  return (
    <section
      className="exploration section-space"
      id="exploration"
      tabIndex="-1"
      aria-labelledby="exploration-title"
    >
      <div className="page-width">
        <SectionLabel number="02">Creative exploration</SectionLabel>

        <div className="exploration-grid">
          <div className="exploration-art" data-reveal>
            <div className="orbital-art" aria-hidden="true">
              <span className="orbit orbit-one" />
              <span className="orbit orbit-two" />
              <span className="orbit orbit-three" />
              <span className="orbit-core" />
              <span className="orbital-cross">+</span>
            </div>
            <div className="exploration-art-caption">
              <span>Study in balance</span>
              <span>Fig. 05 / Geometric composition</span>
            </div>
          </div>

          <div className="exploration-copy" data-reveal>
            <h2 id="exploration-title">
              Less, but<br />
              <span>with intention.</span>
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <TextLink
              href="#journal"
              onClick={(event) => navigate(event, 'journal')}
            >
              Explore the perspective
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
