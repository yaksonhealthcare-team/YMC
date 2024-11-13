import { Branch } from "../types/Branch.ts"
import { axiosClient } from "../queries/clients.ts"
import { BranchFilters } from "../queries/types/branch.types.ts"

export const fetchBranches = async (filters: BranchFilters): Promise<Branch[]> => {
  const { data, request } = await axiosClient.get("/branches/branches", {
    params: {
      page: filters.page,
      nowlat: 37.523040, //filters.latitude,
      nowlon: 127.028841, //filters.longitude,
    },
  })
  console.log(request)
  console.log(data)
  return []
}
