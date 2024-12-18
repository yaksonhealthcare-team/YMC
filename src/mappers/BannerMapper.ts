import { Banner, BannerResponse } from "../types/Banner.ts"

export class BannerMapper {
  static toEntity(dto: BannerResponse): Banner {
    return {
      code: dto.code,
      title: dto.title,
      link: dto.link,
      prior: dto.prior,
      fileCode: dto.fileCode,
      fileUrl: dto.fileurl,
    }
  }

  static toEntities(dtos: BannerResponse[]): Banner[] {
    return dtos.map(this.toEntity)
  }
}
