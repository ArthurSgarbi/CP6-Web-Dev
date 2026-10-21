import { useState } from 'react';
import Icon from './Icon.jsx';
import SectionLabel from './SectionLabel.jsx';

const editorial = [
  {
    title: 'Find the essential.',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Make room for possibility.',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
  {
    title: 'Refine every detail.',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
  },
];

export default function Journal() {
  const [expanded, setExpanded] = useState(0);

  return (
    <section
      className="journal page-width section-space"
      id="journal"
      tabIndex="-1"
      aria-labelledby="journal-title"
    >
      <SectionLabel number="03">Notes on perspective</SectionLabel>

      <div className="journal-grid">
        <div className="journal-intro" data-reveal>
          <h2 id="journal-title">
            Crafting<br />
            experiences<span className="title-dot">.</span>
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            commodo ligula eget dolor.
          </p>
          <Icon name="spark" className="journal-spark" />
        </div>

        <div className="editorial-list" data-reveal>
          {editorial.map((item, index) => (
            <div
              className={`editorial-item ${expanded === index ? 'is-expanded' : ''}`}
              key={item.title}
            >
              <h3>
                <button
                  aria-expanded={expanded === index}
                  aria-controls={`editorial-panel-${index}`}
                  id={`editorial-button-${index}`}
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  <span className="editorial-number">0{index + 1}</span>
                  <span>{item.title}</span>
                  <Icon name="plus" />
                </button>
              </h3>
              <div
                id={`editorial-panel-${index}`}
                role="region"
                aria-labelledby={`editorial-button-${index}`}
                hidden={expanded !== index}
              >
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
