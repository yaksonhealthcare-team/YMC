import { Branch } from "../types/Branch.ts"
import { axiosClient } from "../queries/clients.ts"
import { BranchFilters } from "../queries/types/branch.types.ts"
import { BranchMapper } from "../types/dtos/mapper/BranchMapper.ts"

export const fetchBranches = async (filters: BranchFilters): Promise<Branch[]> => {
  const { data } = await axiosClient.get("/branches/branches", {
    params: {
      page: filters.page,
      nowlat: filters.latitude,
      nowlon: filters.longitude,
    },
  })
  return BranchMapper.toEntities(data.body)
}
