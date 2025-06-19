import { useQuery } from '@tanstack/react-query';
import { fetchBrand, fetchBrands } from '../apis/brands.api.ts';

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => fetchBrands(),
    retry: false
  });
};

export const useBrand = (brandCode?: string) => {
  return useQuery({
    queryKey: ['brand', brandCode],
    queryFn: () => fetchBrand(brandCode!),
    enabled: !!brandCode,
    retry: false
  });
};
