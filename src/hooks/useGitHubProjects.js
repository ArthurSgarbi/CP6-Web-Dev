import { useQuery } from '@tanstack/react-query';
import { getUserRepositories } from '../services/githubApi.js';
import { formatRepositories } from '../utils/formatRepository.js';
import { getFeaturedProjects, selectFeatured } from '../services/adminApi.js';
import { githubUsername } from '../config/portfolio.js';

export { githubUsername };
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

export default function useGitHubProjects({ enabled = true, all = false } = {}) {
  const repositories = useQuery({
    ...githubQueryOptions,
    queryKey: githubKeys.repositories(githubUsername),
    // Keep the in-flight request across StrictMode remounts for deduplication.
    // The service owns its timeout instead of consuming Query's abort signal.
    queryFn: () => getUserRepositories(githubUsername),
    select: (items) => formatRepositories(items, { includeForks: true }),
    enabled,
  });
  const featured = useQuery({ queryKey: ['featured'], queryFn: getFeaturedProjects, enabled: enabled && !all,
    staleTime: 0, retry: false, refetchOnWindowFocus: true });
  if (all) return repositories;
  return { ...repositories, data: selectFeatured(repositories.data || [], featured.data || []),
    emptyReason: repositories.data?.length ? 'selection' : 'repositories',
    isLoading: repositories.isLoading || featured.isLoading,
    isPending: repositories.isPending || featured.isPending,
    isFetching: repositories.isFetching || featured.isFetching,
    error: repositories.error || featured.error,
    refetch: () => Promise.all([repositories.refetch(), featured.refetch()]) };
}
