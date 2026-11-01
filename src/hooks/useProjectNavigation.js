import useGitHubProjects from './useGitHubProjects.js';

// A lista do portfólio gerencia a filtragem e a ordenação. Reutilize sua consulta para que uma
// rota direta e uma rota acessada pela página inicial sempre tenham os mesmos projetos vizinhos.
export default function useProjectNavigation(repositoryName, { enabled = true } = {}) {
  const { data: projects = [], isPending, error } = useGitHubProjects({ enabled });
  const currentIndex = error ? -1 : projects.findIndex(
    (project) => project.slug.toLowerCase() === repositoryName?.toLowerCase(),
  );

  return {
    previous: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null,
    isPending: enabled && isPending,
    error,
  };
}
