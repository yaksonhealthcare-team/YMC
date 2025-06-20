import { useMutation } from '@tanstack/react-query';
import { saveVisitedStore } from '../apis/user';

export const useSaveVisitedStoreMutation = () => {
  return useMutation({
    mutationFn: (b_idx: string) => saveVisitedStore({ b_idx }),
    retry: false
  });
};
