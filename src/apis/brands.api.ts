import { Brand, BrandDetail, BrandDetailResponse, BrandResponse } from "../types/Brand.ts"
import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { BrandDetailMapper, BrandMapper } from "../mappers/BrandMapper.ts"

export const fetchBrands = async (): Promise<Brand[]> => {
  const { data } =
    await axiosClient.get<HTTPResponse<BrandResponse[]>>("/brands/brands")
  return BrandMapper.toEntities(data.body)
}

export const fetchBrand = async (brandCode: string): Promise<BrandDetail> => {
  const { data } = await axiosClient.get<HTTPResponse<BrandDetailResponse>>(
    "/brands/detail",
    {
      params: {
        brand_code: brandCode,
      },
    },
  )
  return BrandDetailMapper.toEntity(data.body)
}
