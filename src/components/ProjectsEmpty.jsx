export default function ProjectsEmpty() {
  return (
    <div className="projects-state" role="status" aria-live="polite">
      <p className="projects-state-title">Nenhum projeto público foi encontrado.</p>
      <p>Os projetos aparecerão aqui quando houver repositórios públicos originais e não arquivados no GitHub.</p>
    </div>
  );
}
