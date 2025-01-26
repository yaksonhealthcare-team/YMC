import { axiosInstance } from "./instance"

export interface Branch {
  name: string
  address: string
}

export const getActiveBranches = async (): Promise<Branch[]> => {
  const { data } = await axiosInstance.get<Branch[]>("/branch/active")
  return data
}
