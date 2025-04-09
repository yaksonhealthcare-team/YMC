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
      mp_idx: filters.mp_idx,
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
    data: {
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
    data: {
      b_idx: branchId,
    },
  })
}

// 지점 카테고리 목록 조회
// export const fetchBranchCategories = async (
//   brandCode?: string,
// ): Promise<BranchCategory[]> => {
//   try {
//     // 모든 카테고리를 가져오기 위해 브랜드 코드 파라미터를 제거
//     const { data } = await axiosClient.get("/categories/categories", {
//       params: {
//         // 브랜드 코드가 있을 때만 전달
//         ...(brandCode ? { brand_code: brandCode } : {}),
//       },
//     })

//     if (!data.body || !Array.isArray(data.body)) {
//       return []
//     }

//     // 브랜드 코드를 매퍼에 전달하여 현재 브랜드에 맞는 카테고리만 필터링
//     return BranchMapper.toCategoryEntities(data.body, brandCode)
//   } catch (error) {
//     return []
//   }
// }
