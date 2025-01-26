import {
  BranchDetail,
  BranchesWithCurrentAddress,
  BranchFilters,
} from "../types/Branch.ts"
import { axiosClient } from "../queries/clients.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { BranchMapper } from "mappers/BranchMapper.ts"
import { Branch } from "../types/Branch.ts"

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
  return BranchMapper.toEntities(data.body)
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
export const getBranchBookmarks = async (
  coords?: Coordinate,
): Promise<Branch[]> => {
  if (!coords) return []

  const { data } = await axiosClient.get("/bookmarks/bookmarks", {
    params: {
      page: 1,
      nowlat: coords.latitude,
      nowlon: coords.longitude,
    },
  })
  return data.body || []
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
    data: {
      b_idx: branchId,
    },
  })
}
