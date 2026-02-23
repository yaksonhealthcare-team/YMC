import { authApi } from '@/shared/api/instance';
import { BranchMapper } from '@/entities/branch/lib/BranchMapper';
import { BranchDetail, BranchesWithCurrentAddress, BranchFilters } from '@/entities/branch/model/Branch';
import { Coordinate } from '@/shared/types/Coordinate';

export const fetchBranches = async (filters: BranchFilters): Promise<BranchesWithCurrentAddress> => {
  const { data } = await authApi.get('/branches/branches', {
    params: {
      page: filters.page,
      nowlat: filters.latitude,
      nowlon: filters.longitude,
      brand_code: filters.brandCode,
      csbc_idx: filters.category,
      search: filters.search,
      mp_idx: filters.mp_idx
    }
  });
  return BranchMapper.toEntities(data);
};

export const fetchBranch = async (id: string, coords?: Coordinate): Promise<BranchDetail> => {
  const params: { b_idx: string; nowlat?: number; nowlon?: number } = {
    b_idx: id
  };
  if (coords) {
    params.nowlat = coords.latitude;
    params.nowlon = coords.longitude;
  }

  const { data } = await authApi.get('/branches/detail', {
    params: params
  });
  if (!data.body || data.body.length === 0) {
    throw new Error(`Branch data not found for ID: ${id}`);
  }
  return BranchMapper.toDetailEntity(data.body[0]);
};

// 즐겨찾는 지점 목록 조회
export const getBranchBookmarks = async (coords?: Coordinate) => {
  if (!coords) return { branches: [], address: '' };

  const response = await authApi.get('/bookmarks/bookmarks', {
    params: {
      page: 1,
      nowlat: coords.latitude,
      nowlon: coords.longitude
    }
  });
  return BranchMapper.toBookmarkEntities(response.data);
};

// 즐겨찾기 추가
export const addBranchBookmark = async (branchId: string) => {
  return authApi.post('/bookmarks/bookmarks', {
    b_idx: branchId
  });
};

// 즐겨찾기 제거
export const removeBranchBookmark = async (branchId: string) => {
  return authApi.delete('/bookmarks/bookmarks', {
    params: {
      b_idx: branchId
    }
  });
};
