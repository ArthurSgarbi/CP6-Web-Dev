import useGitHubProjects from './useGitHubProjects.js';

// The portfolio list owns filtering and ordering. Reuse its query so a direct
// route and a route reached from the home page always have the same neighbors.
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
