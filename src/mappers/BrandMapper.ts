import { Brand, BrandResponse, BrandDetailResponse } from "../types/Brand.ts"

export class BrandMapper {
  static toEntity(dto: BrandResponse | BrandDetailResponse): Brand {
    return {
      code: dto.brand_code,
      name: dto.brand_name,
      imageUrl: dto.brand_pic,
      description: dto.description,
      thumbnail: dto.thumbnail,
      pictures: dto.files,
      seq: "seq" in dto ? dto.seq : undefined,
    }
  }

  static toEntities(dtos: BrandResponse[]): Brand[] {
    return dtos.map(this.toEntity)
  }
}
