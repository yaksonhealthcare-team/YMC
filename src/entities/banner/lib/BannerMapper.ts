import { Banner, BannerResponse } from '@/entities/banner/model/Banner';

export class BannerMapper {
  static toEntity(dto: BannerResponse['body'][0]): Banner {
    return {
      code: dto.code,
      title: dto.title,
      link: dto.link,
      prior: dto.prior,
      fileCode: dto.fileCode,
      fileUrl: dto.fileurl,
      startDate: dto.sdate,
      endDate: dto.edate
    };
  }

  static toEntities(response: BannerResponse): Banner[] {
    const isVisible = response.use === 'Y';
    return response.body.map((dto) => ({
      ...this.toEntity(dto),
      isVisible
    }));
  }
}
