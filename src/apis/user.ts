import { axiosClient } from '@/queries/clients';

interface SaveVisitedStoreRequest {
  b_idx: string;
}

export async function saveVisitedStore(data: SaveVisitedStoreRequest) {
  const response = await axiosClient.post('/api/me/visited-stores', data);
  return response.data;
}
