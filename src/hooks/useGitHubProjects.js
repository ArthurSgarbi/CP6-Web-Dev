import { useQuery } from '@tanstack/react-query';
import { getUserRepositories } from '../services/githubApi.js';
import { formatRepositories } from '../utils/formatRepository.js';

export const githubUsername = (import.meta.env.VITE_GITHUB_USERNAME ?? '').trim();
export const githubKeys = {
  repositories: (username) => ['github', username.toLowerCase(), 'repositories'],
  repository: (username, name) => ['github', username.toLowerCase(), 'repository', name.toLowerCase()],
};

export const githubQueryOptions = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  retryOnMount: false,
  networkMode: 'always',
  retry: (failureCount, error) => failureCount < 1 && (
    ['NETWORK', 'TIMEOUT'].includes(error.code) ||
    (error.code === 'UNAVAILABLE' && error.status >= 500)
  ),
  retryDelay: 1000,
};

export default function useGitHubProjects({ enabled = true } = {}) {
  return useQuery({
    ...githubQueryOptions,
    queryKey: githubKeys.repositories(githubUsername),
    // Keep the in-flight request across StrictMode remounts for deduplication.
    // The service owns its timeout instead of consuming Query's abort signal.
    queryFn: () => getUserRepositories(githubUsername),
    select: formatRepositories,
    enabled,
  });
}
