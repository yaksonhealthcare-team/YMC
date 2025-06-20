import { Brand, BrandDetail, BrandDetailResponse, BrandResponse } from '@/types/Brand';

export class BrandMapper {
  static toEntity(dto: BrandResponse): Brand {
    return {
      code: dto.brand_code,
      name: dto.brand_name,
      imageUrl: dto.brand_pic,
      displayYn: dto.brand_display_yn === 'Y',
      csbIdx: dto.csb_idx,
      prior: dto.prior
    };
  }

  static toEntities(dtos: BrandResponse[]): Brand[] {
    return dtos.map(this.toEntity);
  }
}

export class BrandDetailMapper {
  static toEntity(dto: BrandDetailResponse): BrandDetail {
    return {
      descriptionImageUrls: dto.brand_pic,
      logoImageUrl: dto.thumbnail
    };
  }
}
