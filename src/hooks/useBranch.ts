import { fetchBranch } from '@/apis/branch.api';
import { BranchDetail } from '@/types/Branch';
import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from './useGeolocation';

const staleTime = 1000 * 60 * 5; // 5분

export function useBranch(branchId: string | undefined) {
  const { location: coordinates, loading: isCoordsLoading, error: coordsError } = useGeolocation();

  const {
    data: branchDetail,
    isLoading: isBranchLoading,
    error: branchError,
    ...rest
  } = useQuery<BranchDetail, Error>({
    queryKey: ['branch', branchId],
    queryFn: async () => {
      if (!branchId) {
        throw new Error('Branch ID is missing.');
      }
      return fetchBranch(branchId, coordinates);
    },
    enabled: !!branchId,
    staleTime: staleTime,
    retry: false,
    refetchOnWindowFocus: false
  });

  return {
    data: branchDetail,
    isLoading: isBranchLoading,
    error: branchError,
    ...rest,
    isCoordsLoading,
    coordsError
  };
}
