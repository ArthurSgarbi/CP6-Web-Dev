export default function ProjectsEmpty({ reason = 'repositories' }) {
  const noSelection = reason === 'selection';
  return (
    <div className="projects-state" role="status" aria-live="polite">
      <p className="projects-state-title">{noSelection ? 'Nenhum projeto em destaque no momento.' : 'Nenhum repositório público disponível.'}</p>
      <p>{noSelection ? 'A seleção desta seção está em atualização. Você pode conhecer meu processo ou entrar em contato.' : 'Não há repositórios públicos não arquivados disponíveis para esta coleção.'}</p>
    </div>
  );
}
