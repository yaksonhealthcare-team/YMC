import { getUser } from '@/features/auth/lib/auth.services';
import { ENDPOINT } from '@/shared/constants/endpoint';

export const useGetUser = () => ({
  queryKey: [ENDPOINT.USER],
  queryFn: () => getUser()
});
