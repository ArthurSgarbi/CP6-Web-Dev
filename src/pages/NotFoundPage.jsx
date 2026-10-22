import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage({ repositoryName }) {
  const titleRef = useRef(null);
  useEffect(() => {
    document.title = 'Página não encontrada — Digital Excellence';
    titleRef.current?.focus();
  }, []);
  return (
    <main className="project-page page-width section-space">
      <span className="project-eyebrow">404 / Página não encontrada</span>
      <h1 className="project-page-title" ref={titleRef} tabIndex="-1">{repositoryName ? 'Repositório não encontrado' : 'Esta página não existe'}</h1>
      <p className="project-note">{repositoryName
        ? `O repositório “${repositoryName}” não existe ou não está disponível publicamente no GitHub.`
        : 'Confira o endereço ou volte para explorar os projetos.'}</p>
      <Link className="text-link project-back" to="/#work">← Voltar aos projetos</Link>
    </main>
  );
}
