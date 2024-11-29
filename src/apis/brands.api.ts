import { Brand, BrandResponse } from "../types/Brand.ts"
import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { BrandMapper } from "../mappers/BrandMapper.ts"

export const fetchBrands = async (): Promise<Brand[]> => {
  const { data } =
    await axiosClient.get<HTTPResponse<BrandResponse[]>>("/brands/brands")
  return BrandMapper.toEntities(data.body)
}
