import { Branch, BranchDetail } from "../types/Branch.ts"
import { axiosClient } from "../queries/clients.ts"
import { BranchFilters } from "../queries/types/branch.types.ts"
import { BranchMapper } from "../types/dtos/mapper/BranchMapper.ts"
import { Coordinate } from "../types/Coordinate.ts"

export const fetchBranches = async (
  filters: BranchFilters,
): Promise<Branch[]> => {
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
