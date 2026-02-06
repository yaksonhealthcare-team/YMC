import { getUser } from '@/_domain';
import { ENDPOINT } from '@/_shared';

export const useGetUser = () => ({
  queryKey: [ENDPOINT.USER],
  queryFn: () => getUser()
});
