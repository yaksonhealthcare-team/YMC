import { useQuery } from '@tanstack/react-query';
import { fetchTerms } from '@apis/terms.api';

export const useTerms = (termsCategoryIdx: number = 0, isUse: string = 'Y') => {
  return useQuery({
    queryKey: ['terms', termsCategoryIdx, isUse],
    queryFn: () => fetchTerms(termsCategoryIdx, isUse)
  });
};

export const useTermsByCategory = (termsCategoryIdx: number, isUse: string = 'Y') => {
  return useQuery({
    queryKey: ['terms', termsCategoryIdx, isUse],
    queryFn: () => fetchTerms(termsCategoryIdx, isUse)
  });
};
