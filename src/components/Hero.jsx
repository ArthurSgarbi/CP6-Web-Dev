import Icon from './Icon.jsx';
import TextLink from './TextLink.jsx';

export default function Hero({ navigate }) {
  return (
    <section className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-overline">
        <span className="status-label">
          <span className="status-dot" />
          A study in form & function
        </span>
        <span className="edition-label">
          Independent visual exploration — Vol. 01
        </span>
      </div>

      <h1 className="hero-title" id="hero-title">
        <span>Digital</span>
        <span className="hero-second-line">
          Excellence<span className="title-dot">.</span>
          <Icon name="spark" className="hero-spark" />
        </span>
      </h1>

      <div className="hero-support">
        <span className="hero-index">(SCROLL TO DISCOVER)</span>
        <div className="hero-description">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <TextLink
            href="#work"
            onClick={(event) => navigate(event, 'work')}
          >
            Explore selected works
          </TextLink>
        </div>
      </div>

      <a
        className="hero-art"
        href="#work"
        onClick={(event) => navigate(event, 'work')}
        aria-label="Explore the collection of visual studies"
      >
        <img
          src="/images/hero-abstract.jpg"
          alt="Flowing abstract waves in violet, cyan and warm orange."
          width="1800"
          height="1368"
          fetchPriority="high"
        />
        <span className="art-topline">
          <span>01 — Abstract perspectives</span>
          <Icon name="plus" />
        </span>
        <span className="art-bottomline">
          <span>Form. Color. Possibility.</span>
          <span className="art-scroll">
            <Icon name="arrow-down" />
          </span>
        </span>
      </a>

      <div className="hero-caption">
        <span>Art in the details.</span>
        <span>Illustrative visual study / Unsplash</span>
        <span aria-hidden="true">↓</span>
      </div>
    </section>
  );
}
