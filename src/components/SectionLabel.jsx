export default function SectionLabel({ number, children, className = '' }) {
  return (
    <div className={`section-label ${className}`}>
      <span className="section-number">({number})</span>
      <span>{children}</span>
    </div>
  );
}
