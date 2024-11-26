import { Brand } from "../types/Brand.ts"
import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/dtos/HTTPResponse.ts"
import { BrandDTO } from "../types/dtos/BrandDTO.ts"
import { BrandMapper } from "../types/dtos/mapper/BrandMapper.ts"

export const fetchBrands = async (): Promise<Brand[]> => {
  const { data } =
    await axiosClient.get<HTTPResponse<BrandDTO[]>>("/brands/brands")
  return BrandMapper.toEntities(data.body)
}
