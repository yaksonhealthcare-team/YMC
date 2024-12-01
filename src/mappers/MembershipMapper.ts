import { ServiceCategory, ServiceCategoryResponse } from "types/Membership"

export class ServiceCategoryMapper {
  static toEntity(dto: ServiceCategoryResponse): ServiceCategory {
    return {
      brandCode: dto.brand_code,
      serviceCategoryCode: dto.sc_code,
      serviceCategoryName: dto.sc_name,
      serviceCategoryImageUrl: dto.sc_pic,
      priorirty: dto.prior,
    }
  }

  static toEntities(dtos: ServiceCategoryResponse[]): ServiceCategory[] {
    return dtos.map(this.toEntity)
  }
}
