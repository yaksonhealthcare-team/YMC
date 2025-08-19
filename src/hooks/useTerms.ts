import { fetchTerms } from '@/apis/terms.api';
import { useQuery } from '@tanstack/react-query';

export const useTermsByCategory = (termsCategoryIdx: number, isUse: string = 'Y') => {
  return useQuery({
    queryKey: ['terms', termsCategoryIdx, isUse],
    queryFn: () => fetchTerms(termsCategoryIdx, isUse)
  });
};
