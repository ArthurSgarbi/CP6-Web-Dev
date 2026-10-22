import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRepositoryByName } from '../services/githubApi.js';
import { formatRepository } from '../utils/formatRepository.js';
import { githubKeys, githubQueryOptions, githubUsername } from './useGitHubProjects.js';

export default function useGitHubProject(repositoryName) {
  const queryClient = useQueryClient();
  const listKey = githubKeys.repositories(githubUsername);

  return useQuery({
    ...githubQueryOptions,
    queryKey: githubKeys.repository(githubUsername, repositoryName),
    queryFn: () => getRepositoryByName(githubUsername, repositoryName),
    select: formatRepository,
    initialData: () => queryClient.getQueryData(listKey)?.find(
      (repository) => repository.name.toLowerCase() === repositoryName.toLowerCase(),
    ),
    initialDataUpdatedAt: () => queryClient.getQueryState(listKey)?.dataUpdatedAt,
  });
}
