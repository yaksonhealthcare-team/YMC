import { Brand, BrandDetail, BrandDetailResponse, BrandResponse } from "../types/Brand.ts"

export class BrandMapper {
  static toEntity(dto: BrandResponse): Brand {
    return {
      code: dto.brand_code,
      name: dto.brand_name,
      imageUrl: dto.brand_pic,
    }
  }

  static toEntities(dtos: BrandResponse[]): Brand[] {
    return dtos.map(this.toEntity)
  }
}

export class BrandDetailMapper {
  static toEntity(dto: BrandDetailResponse): BrandDetail {
    return {
      descriptionImageUrls: dto.brand_pic,
      logoImageUrl: dto.thumbnail,
    }
  }
}
