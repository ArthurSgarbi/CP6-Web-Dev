import Icon from './Icon.jsx';

export default function TextLink({ children, href, onClick, className = '' }) {
  return (
    <a className={`text-link ${className}`} href={href} onClick={onClick}>
      <span>{children}</span>
      <Icon name="arrow-up-right" />
    </a>
  );
}
