import {
  BranchDetail,
  BranchesWithCurrentAddress,
  BranchFilters,
} from "../types/Branch.ts"
import { axiosClient } from "../queries/clients.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { BranchMapper } from "../mappers/BranchMapper"

export const fetchBranches = async (
  filters: BranchFilters,
): Promise<BranchesWithCurrentAddress> => {
  const { data } = await axiosClient.get("/branches/branches", {
    params: {
      page: filters.page,
      nowlat: filters.latitude,
      nowlon: filters.longitude,
      brand_code: filters.brandCode,
      csbc_idx: filters.category,
      search: filters.search,
    },
  })
  return BranchMapper.toEntities(data)
}

export const fetchBranch = async (
  id: string,
  coords: Coordinate,
): Promise<BranchDetail> => {
  const { data } = await axiosClient.get("/branches/detail", {
    params: {
      b_idx: id,
      nowlat: coords.latitude,
      nowlon: coords.longitude,
    },
  })
  return BranchMapper.toDetailEntity(data.body[0])
}

export const bookmarkBranch = async (id: string): Promise<void> => {
  await axiosClient.post("/bookmarks/bookmarks", { b_idx: id })
}

export const unbookmarkBranch = async (id: string): Promise<void> => {
  await axiosClient.delete("/bookmarks/bookmarks", {
    params: {
      b_idx: id,
    },
  })
}

// 즐겨찾는 지점 목록 조회
export const getBranchBookmarks = async (coords?: Coordinate) => {
  if (!coords) return { branches: [], address: "" }

  const response = await axiosClient.get("/bookmarks/bookmarks", {
    params: {
      page: 1,
      nowlat: coords.latitude,
      nowlon: coords.longitude,
    },
  })
  return BranchMapper.toBookmarkEntities(response.data)
}

// 즐겨찾기 추가
export const addBranchBookmark = async (branchId: string) => {
  return axiosClient.post("/bookmarks/bookmarks", {
    b_idx: branchId,
  })
}

// 즐겨찾기 제거
export const removeBranchBookmark = async (branchId: string) => {
  return axiosClient.delete("/bookmarks/bookmarks", {
    params: {
      b_idx: branchId,
    },
  })
}
