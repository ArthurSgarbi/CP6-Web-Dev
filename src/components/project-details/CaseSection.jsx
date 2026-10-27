export default function CaseSection({ id, index, title, children, className = '' }) {
  return (
    <section className={`case-section ${className}`} aria-labelledby={id}>
      <div className="case-section-heading">
        <span className="case-index" aria-hidden="true">{index} /</span>
        <h2 id={id}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
