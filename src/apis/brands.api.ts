import { authApi } from '@/_shared';
import { BrandDetailMapper, BrandMapper } from '@/mappers/BrandMapper';
import { Brand, BrandDetail, BrandDetailResponse, BrandResponse } from '@/types/Brand';
import { HTTPResponse } from '@/types/HTTPResponse';

export const fetchBrands = async (): Promise<Brand[]> => {
  const { data } = await authApi.get<HTTPResponse<BrandResponse[]>>('/brands/brands');
  return BrandMapper.toEntities(data.body);
};

export const fetchBrand = async (brandCode: string): Promise<BrandDetail> => {
  const { data } = await authApi.get<HTTPResponse<BrandDetailResponse>>('/brands/detail', {
    params: {
      brand_code: brandCode
    }
  });
  return BrandDetailMapper.toEntity(data.body);
};
