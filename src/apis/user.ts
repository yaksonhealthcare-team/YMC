import { authApi } from '@/_shared';

interface SaveVisitedStoreRequest {
  b_idx: string;
}

export async function saveVisitedStore(data: SaveVisitedStoreRequest) {
  const response = await authApi.post('/api/me/visited-stores', data);
  return response.data;
}
